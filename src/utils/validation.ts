/**
 * Safely parse a numeric string. Returns null if the value is not a valid
 * finite number (rejects "1.2.3", "abc", NaN, Infinity, etc.).
 */
export function safeParseNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  // Reject strings that parseFloat would partially consume (e.g. "1.2.3" → 1.2)
  if (!/^-?\d+(\.\d+)?$/.test(trimmed)) return null;
  const num = parseFloat(trimmed);
  if (!isFinite(num)) return null;
  return num;
}

const MAX_WEIGHT_LBS = 99999;
const MAX_PRICE_PER_LB = 9999;

/**
 * Validate a weight value. Returns the parsed number or null if invalid.
 */
export function validateWeight(value: string): number | null {
  const num = safeParseNumber(value);
  if (num === null || num <= 0 || num > MAX_WEIGHT_LBS) return null;
  return num;
}

/**
 * Validate a price per lb value. Returns the parsed number or null if invalid.
 */
export function validatePrice(value: string): number | null {
  const num = safeParseNumber(value);
  if (num === null || num <= 0 || num > MAX_PRICE_PER_LB) return null;
  return num;
}

/**
 * Escape HTML special characters to prevent injection in print templates.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
