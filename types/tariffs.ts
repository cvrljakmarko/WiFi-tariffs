export type Currency = 'EUR' | 'USD' | 'GBP';
export type BillingCycle = 'monthly' | 'yearly' | 'weekly' | 'daily';

export interface FixedPrice {
    currency: Currency;
    amount: number;
}

export interface Prices {
    cycles?: Partial<Record<BillingCycle, FixedPrice>>;
    custom?: boolean;
    note?: string;
}

export interface Features {
    bandwidth?: string;
    online_duration?: string;
    support?: string;
    custom_domain?: boolean;
    [key: string]: string | number | boolean | undefined;
}

export interface Tariff {
    id: string;
    name: string;
    features: Features;
    prices: Prices;
}

