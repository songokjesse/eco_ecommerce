/**
 * PostNord API Client
 * Documentation: https://developer.postnord.com/
 */

export interface PostNordConfig {
    apiKey: string;
    customerId: string;
    environment: 'sandbox' | 'production';
}

export interface ShipmentAddress {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    countryCode: string; // ISO 3166-1 alpha-2 (e.g., "SE", "DK", "NO", "FI")
    phone?: string;
    email?: string;
}

export interface ParcelDimensions {
    weight: number; // in kg
    length?: number; // in cm
    width?: number; // in cm
    height?: number; // in cm
}

export interface CreateShipmentRequest {
    sender: ShipmentAddress;
    recipient: ShipmentAddress;
    parcel: ParcelDimensions;
    serviceCode: string; // e.g., "19", "17" for different service types
    reference?: string; // Your order ID or reference
    additionalServices?: string[];
}

export interface CreateShipmentResponse {
    shipmentId: string;
    trackingNumber: string;
    labelUrl?: string;
    estimatedDelivery?: string;
}

export interface TrackingStatus {
    trackingNumber: string;
    status: string;
    statusDescription: string;
    estimatedDelivery?: string;
    actualDelivery?: string;
    events: TrackingEventData[];
}

export interface TrackingEventData {
    timestamp: string;
    status: string;
    description: string;
    location?: string;
    city?: string;
    countryCode?: string;
}

class PostNordClient {
    private apiKey: string;
    private customerId: string;
    private baseUrl: string;

    constructor(config: PostNordConfig) {
        this.apiKey = config.apiKey;
        this.customerId = config.customerId;
        this.baseUrl =
            config.environment === 'production'
                ? 'https://api2.postnord.com'
                : 'https://api2-stage.postnord.com';
    }

    /**
     * Create a new shipment with PostNord
     */
    async createShipment(
        request: CreateShipmentRequest
    ): Promise<CreateShipmentResponse> {
        try {
            // PostNord Business Customer API - Create Shipment
            const response = await fetch(
                `${this.baseUrl}/rest/businesscustomer/v1/shipment`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': this.apiKey,
                    },
                    body: JSON.stringify({
                        customerNumber: this.customerId,
                        shipment: {
                            sender: {
                                name: request.sender.name,
                                address: {
                                    streetName: request.sender.address,
                                    postalCode: request.sender.postalCode,
                                    city: request.sender.city,
                                    countryCode: request.sender.countryCode,
                                },
                                contact: {
                                    phone: request.sender.phone,
                                    email: request.sender.email,
                                },
                            },
                            recipient: {
                                name: request.recipient.name,
                                address: {
                                    streetName: request.recipient.address,
                                    postalCode: request.recipient.postalCode,
                                    city: request.recipient.city,
                                    countryCode: request.recipient.countryCode,
                                },
                                contact: {
                                    phone: request.recipient.phone,
                                    email: request.recipient.email,
                                },
                            },
                            parcel: {
                                weight: request.parcel.weight * 1000, // Convert kg to grams
                                length: request.parcel.length,
                                width: request.parcel.width,
                                height: request.parcel.height,
                            },
                            product: {
                                productCode: request.serviceCode,
                            },
                            reference: request.reference,
                            additionalServices: request.additionalServices || [],
                        },
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(
                    `PostNord API error: ${response.status} - ${errorData}`
                );
            }

            const data = await response.json();

            return {
                shipmentId: data.shipmentId,
                trackingNumber: data.trackingNumber || data.parcelNumber,
                labelUrl: data.labelUrl,
                estimatedDelivery: data.estimatedDeliveryDate,
            };
        } catch (error) {
            console.error('Error creating PostNord shipment:', error);
            throw error;
        }
    }

    /**
     * Get tracking information for a shipment
     */
    async trackShipment(trackingNumber: string): Promise<TrackingStatus> {
        try {
            const response = await fetch(
                `${this.baseUrl}/rest/shipment/v5/trackandtrace/findByIdentifier.json?id=${trackingNumber}&locale=en`,
                {
                    method: 'GET',
                    headers: {
                        'api-key': this.apiKey,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(
                    `PostNord tracking API error: ${response.status} - ${errorData}`
                );
            }

            const data = await response.json();
            const shipment = data.TrackingInformationResponse?.shipments?.[0];

            if (!shipment) {
                throw new Error('No tracking information found');
            }

            const events: TrackingEventData[] =
                shipment.items?.[0]?.events?.map((event: any) => ({
                    timestamp: event.eventTime,
                    status: event.status,
                    description: event.eventDescription,
                    location: event.location?.displayName,
                    city: event.location?.city,
                    countryCode: event.location?.countryCode,
                })) || [];

            return {
                trackingNumber,
                status: shipment.statusText?.header || 'UNKNOWN',
                statusDescription: shipment.statusText?.body || '',
                estimatedDelivery: shipment.estimatedTimeOfArrival,
                actualDelivery: shipment.deliveredTimeStamp,
                events,
            };
        } catch (error) {
            console.error('Error tracking PostNord shipment:', error);
            throw error;
        }
    }

    /**
     * Get shipping label PDF
     */
    async getShippingLabel(shipmentId: string): Promise<string> {
        try {
            const response = await fetch(
                `${this.baseUrl}/rest/businesscustomer/v1/shipment/${shipmentId}/label`,
                {
                    method: 'GET',
                    headers: {
                        'api-key': this.apiKey,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to get shipping label: ${response.status}`);
            }

            const data = await response.json();
            return data.labelUrl || data.label; // URL to PDF label
        } catch (error) {
            console.error('Error getting PostNord shipping label:', error);
            throw error;
        }
    }

    /**
     * Cancel a shipment
     */
    async cancelShipment(shipmentId: string): Promise<boolean> {
        try {
            const response = await fetch(
                `${this.baseUrl}/rest/businesscustomer/v1/shipment/${shipmentId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'api-key': this.apiKey,
                    },
                }
            );

            return response.ok;
        } catch (error) {
            console.error('Error cancelling PostNord shipment:', error);
            throw error;
        }
    }

    /**
     * Get available service points near an address
     */
    async findServicePoints(
        countryCode: string,
        postalCode: string,
        city: string
    ): Promise<any[]> {
        try {
            const response = await fetch(
                `${this.baseUrl}/rest/businesslocation/v5/servicepoints/nearest/byaddress.json?countryCode=${countryCode}&postalCode=${postalCode}&city=${encodeURIComponent(city)}&numberOfServicePoints=10`,
                {
                    method: 'GET',
                    headers: {
                        'api-key': this.apiKey,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to find service points: ${response.status}`);
            }

            const data = await response.json();
            return data.servicePointInformationResponse?.servicePoints || [];
        } catch (error) {
            console.error('Error finding PostNord service points:', error);
            throw error;
        }
    }
}

// Export singleton instance
let postnordClient: PostNordClient | null = null;

export function getPostNordClient(): PostNordClient {
    if (!postnordClient) {
        const apiKey = process.env.POSTNORD_API_KEY;
        const customerId = process.env.POSTNORD_CUSTOMER_ID;
        const environment = (process.env.POSTNORD_ENVIRONMENT ||
            'sandbox') as 'sandbox' | 'production';

        if (!apiKey || !customerId) {
            throw new Error(
                'PostNord API credentials not configured. Please set POSTNORD_API_KEY and POSTNORD_CUSTOMER_ID in your environment variables.'
            );
        }

        postnordClient = new PostNordClient({
            apiKey,
            customerId,
            environment,
        });
    }

    return postnordClient;
}

export default PostNordClient;
