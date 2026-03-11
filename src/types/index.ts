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

export interface Metal {
  id: string;
  name: string;
  price_per_lb: number;
  is_active: boolean;
}

export interface UserProfile {
  id: string;
  supabaseId: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
}

export interface PendingUser {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}
