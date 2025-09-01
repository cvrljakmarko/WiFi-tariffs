// src/types/tariff.ts

export type Currency = 'EUR' | 'USD' | 'GBP';
export type BillingCycle = 'monthly' | 'yearly' | 'weekly' | 'daily';

export interface FixedPrice {
    currency: Currency;
    amount: number; // e.g. 9.99
}

export interface Prices {
    /** Map of billing cycles to fixed prices (optional, flexible). */
    cycles?: Partial<Record<BillingCycle, FixedPrice>>;
    /** Mark plan as custom-priced (e.g. Enterprise). */
    custom?: boolean;
    /** Optional note for custom/POA pricing. */
    note?: string;
}

export interface Features {
    bandwidth?: string;        // "100 GB"
    online_duration?: string;  // "30 days"
    support?: string;          // "Email only"
    custom_domain?: boolean;
    // Extend freely:
    [key: string]: string | number | boolean | undefined;
}

export interface Tariff {
    id: string;   // machine-safe slug, e.g. "basic-plan"
    name: string; // display name, e.g. "Basic"
    features: Features;
    prices: Prices;
}
