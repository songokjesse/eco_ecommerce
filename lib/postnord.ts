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
        try {
            // Construct payload based on User's Booking API Guide
            const shipmentData = {
                shipment: {
                    consignor: {
                        customerNumber: request.customerNumber,
                        name: request.sender.name,
                        address: {
                            street1: request.sender.address,
                            city: request.sender.city,
                            postalCode: request.sender.postalCode,
                            country: request.sender.countryCode,
                        },
                        contact: {
                            email: request.sender.email,
                            phone: request.sender.phone, // Ensure +46 or 07 format if possible
                        }
                    },
                    consignee: {
                        name: request.recipient.name,
                        address: {
                            street1: request.recipient.address,
                            city: request.recipient.city,
                            postalCode: request.recipient.postalCode,
                            country: request.recipient.countryCode,
                        },
                        contact: {
                            email: request.recipient.email,
                            phone: request.recipient.phone,
                        }
                    },
                    service: {
                        code: request.serviceCode, // e.g., "19" for MyPack Collect
                        basicService: true
                    },
                    items: [
                        {
                            weight: request.parcel.weight,
                            unit: "kg"
                        }
                    ],
                    additionalServices: request.additionalServices?.map(code => ({ code })) || []
                }
            };

            // Using the Booking API endpoint as implied by the payload structure
            // The previous v3/edi/labels endpoint expects an array, this one expects an object.
            // Adjusting endpoint to v1/shipments which matches this structure.
            // Note: If this fails, we might need to revert to v3 and wrap in array.
            const endpoint = `/rest/shipment/v1/shipments`;

            const response = await fetch(
                `${this.baseUrl}${endpoint}?apikey=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(shipmentData),
                }
            );

            console.log('PostNord Booking Request:', JSON.stringify(shipmentData, null, 2));

            if (!response.ok) {
                const errorData = await response.text();
                // Try to parse JSON error
                try {
                    const errorJson = JSON.parse(errorData);
                    // If it's a validation error, it might be in a different format for v1
                    if (errorJson.messages) {
                        throw new Error(`PostNord API Error: ${errorJson.messages.map((m: any) => m.message).join(', ')}`);
                    }
                } catch (e) {
                    // ignore
                }

                throw new Error(`PostNord API error: ${response.status} - ${errorData}`);
            }

            const data = await response.json();

            // Map response based on guide: { shipmentId: "...", labels: [{ type: "PDF", content: "..." }] }
            const labelContent = data.labels?.find((l: any) => l.type === 'PDF')?.content;

            // If label content is base64, we might want to return it directly or simulate a URL
            // For now, we'll return the base64 string as the "url" effectively, or handle it in the caller
            // The existing interface expects labelUrl. 
            // We'll prefix with data:application/pdf;base64, so the frontend can treat it as a source or download
            const labelUrl = labelContent ? `data:application/pdf;base64,${labelContent}` : undefined;

            return {
                shipmentId: data.shipmentId || 'UNKNOWN_ID',
                trackingNumber: data.shipmentId || 'UNKNOWN_TRACKING', // Booking API often uses shipmentId as tracking or provides separate 'itemIds'
                labelUrl: labelUrl,
                estimatedDelivery: undefined, // Booking API might not return this immediately
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
