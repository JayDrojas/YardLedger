export type UserRole = 'admin' | 'worker';

export type ReceiptType = 'buy' | 'sell';

export interface CustomerInfo {
  name: string;
  phone: string;
}

export interface LineItemInput {
  metalId: string;
  metalName: string;
  weight: number;
  pricePerLb: number;
  originalPricePerLb: number;
  isPriceOverride: boolean;
  overrideApprovedBy: string | null;
  total: number;
}
