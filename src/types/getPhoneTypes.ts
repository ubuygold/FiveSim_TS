export interface IPhoneResponse {
    id: number;
    phone: string;
    operator: string;
    product: string;
    price: number;
    status: string;
    expires: string;
    sms?: any;
    created_at: string;
    forwarding: boolean;
    forwarding_number: string;
    country: string;
}