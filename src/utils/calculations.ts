import type { LineItemInput } from '../types';

export function calculateLineItemTotal(
  weight: number,
  pricePerLb: number
): number {
  return weight * pricePerLb;
}

export function calculateReceiptTotal(lineItems: LineItemInput[]): number {
  return lineItems.reduce((sum, item) => sum + item.total, 0);
}

export function calculateCurrentPreview(
  weight: string,
  pricePerLb: number
): number {
  return (parseFloat(weight) || 0) * pricePerLb;
}

export function calculateInventoryValue(
  weight: number,
  avgCostPerLb: number
): number {
  return weight * avgCostPerLb;
}

export function calculateTotalProfit(
  sales: { profit: number | string }[]
): number {
  return sales.reduce((sum, sale) => sum + Number(sale.profit), 0);
}
