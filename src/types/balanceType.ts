export interface Default_country {
    name: string;
    iso: string;
    prefix: string;
}

export interface Default_operator {
    name: string;
}

export interface IProfile {
    id: number;
    email: string;
    vendor: string;
    default_forwarding_number: string;
    balance: number;
    rating: number;
    default_country: Default_country;
    default_operator: Default_operator;
    frozen_balance: number;
}