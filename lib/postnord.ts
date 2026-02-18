/**
 * PostNord API Client - Platform Model
 * For multi-vendor marketplaces with a centralized PostNord account
 * Documentation: https://developer.postnord.com/
 */

export interface PostNordConfig {
    apiKey: string; // Platform API key (shared across platform)
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
    customerNumber: string; // Platform's PostNord customer number
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
    private baseUrl: string;

    constructor(config: PostNordConfig) {
        this.apiKey = config.apiKey;
        this.baseUrl =
            config.environment === 'production'
                ? 'https://api2.postnord.com'
                : 'https://atapi2.postnord.com';
    }

    async createShipment(
        request: CreateShipmentRequest
    ): Promise<CreateShipmentResponse> {
        // Address validation removed as per user request

        try {
            const shipmentData: any = {
                messageDate: new Date().toISOString(),
                updateIndicator: 'Original',
                shipment: [
                    {
                        customerNumber: request.customerNumber,
                        consignor: {
                            name: request.sender.name,
                            address: {
                                street1: request.sender.address,
                                postCode: request.sender.postalCode,
                                city: request.sender.city,
                                country: request.sender.countryCode,
                            },
                            contact: [
                                {
                                    email: request.sender.email,
                                    phone: request.sender.phone,
                                    contactName: request.sender.name
                                }
                            ]
                        },
                        consignee: {
                            name: request.recipient.name,
                            address: {
                                street1: request.recipient.address,
                                postCode: request.recipient.postalCode,
                                city: request.recipient.city,
                                country: request.recipient.countryCode,
                            },
                            contact: [
                                {
                                    email: request.recipient.email,
                                    phone: request.recipient.phone,
                                    contactName: request.recipient.name
                                }
                            ]
                        },
                        service: {
                            code: request.serviceCode,
                        },
                        items: [ // Using 'items' as standard term
                            {
                                weight: request.parcel.weight,
                                length: request.parcel.length,
                                width: request.parcel.width,
                                height: request.parcel.height,
                                copies: 1
                            }
                        ],
                        labels: [ // Trying to add mandatory output configuration?
                            {
                                type: "PDF"
                            }
                        ],
                        testIndicator: this.baseUrl.includes('atapi2')
                    }
                ]
            };

            // Conditionally add references if present
            if (request.reference) {
                shipmentData.shipment[0].references = [{ value: request.reference }];
            }

            // Conditionally add additionalServices if present and not empty
            if (request.additionalServices && request.additionalServices.length > 0) {
                shipmentData.shipment[0].additionalServices = request.additionalServices.map((code) => ({
                    code,
                }));
            }

            const response = await fetch(
                `${this.baseUrl}/rest/shipment/v3/edi/labels/pdf?apikey=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(shipmentData),
                }
            );

            console.log('PostNord EDI Request:', JSON.stringify(shipmentData, null, 2));

            if (!response.ok) {
                const errorData = await response.text();
                // Check if the response is JSON error
                try {
                    const errorJson = JSON.parse(errorData);
                    // If 400 bad request, try to extract helpful message
                    if (response.status === 400 && errorJson.compositeFault) {
                        const faults = errorJson.compositeFault.faults || [];
                        const faultMsg = faults.map((f: any) => f.explanationText).join('; ');
                        throw new Error(`PostNord API 400 Bad Request: ${faultMsg} - Details: ${JSON.stringify(faults)}`);
                    }
                } catch (e) {
                    // ignore parse error if not json
                }

                if (response.status === 404) {
                    throw new Error(`PostNord API 404: Endpoint not found or API Key not authorized for 'EDI v3' product. Please check your PostNord Developer Portal plan.`);
                }
                throw new Error(
                    `PostNord API error: ${response.status} - ${errorData}`
                );
            }

            const data = await response.json();

            // Return handling
            return {
                shipmentId: data.itemIdentifiers?.[0] || 'UNKNOWN_ID',
                trackingNumber: data.itemIdentifiers?.[0] || 'UNKNOWN_TRACKING',
                labelUrl: undefined,
                estimatedDelivery: undefined,
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
                `${this.baseUrl}/rest/shipment/v5/trackandtrace/findByIdentifier.json?id=${trackingNumber}&locale=en&apikey=${this.apiKey}`,
                {
                    method: 'GET',
                    headers: {},
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
                        'apikey': this.apiKey,
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
                        'apikey': this.apiKey,
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
                        'apikey': this.apiKey,
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

    /**
     * Validate an address by checking if service points can be found near it.
     * This acts as a proxy for address validation since PostNord doesn't have a free dedicated address validation API in this tier.
     */
    async validateAddress(
        countryCode: string,
        postalCode: string,
        city: string
    ): Promise<boolean> {
        // Validation removed as per user request to avoid blocking submission
        // Keeping method signature for compatibility but always returning true
        return true;
    }
}

// Export singleton instance
let postnordClient: PostNordClient | null = null;

export function getPostNordClient(): PostNordClient {
    if (!postnordClient) {
        const apiKey = process.env.POSTNORD_API_KEY;
        const environment = (process.env.POSTNORD_ENVIRONMENT ||
            'sandbox') as 'sandbox' | 'production';

        if (!apiKey) {
            throw new Error(
                'PostNord API credentials not configured. Please set POSTNORD_API_KEY in your environment variables.'
            );
        }

        postnordClient = new PostNordClient({
            apiKey,
            environment,
        });
    }

    return postnordClient;
}

export default PostNordClient;
