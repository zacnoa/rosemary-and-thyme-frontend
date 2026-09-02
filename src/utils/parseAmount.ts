/**
 * Provides the parseAmount function.
 */
export function parseAmount(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return 0;

  const fraction = trimmed.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (fraction) {
    const numerator = Number(fraction[1]);
    const denominator = Number(fraction[2]);
    return denominator > 0 ? numerator / denominator : undefined;
  }

  const decimal = Number(trimmed.replace(",", "."));
  return Number.isFinite(decimal) && decimal >= 0 ? decimal : undefined;
}

/**
 * Lists denominators used when formatting common fractions.
 */
const NICE_FRACTION_DENOMINATORS = [2, 3, 4, 8];

/**
 * Sets the tolerance used when matching decimal values to fractions.
 */
const NICE_FRACTION_TOLERANCE = 0.01;

/**
 * Provides the niceFraction function.
 */
function niceFraction(amount: number): string | undefined {
  if (amount <= 0 || amount >= 1) return undefined;

  for (const denominator of NICE_FRACTION_DENOMINATORS) {
    const numerator = Math.round(amount * denominator);
    if (numerator > 0 && Math.abs(amount - numerator / denominator) < NICE_FRACTION_TOLERANCE) {
      return `${numerator}/${denominator}`;
    }
  }
  return undefined;
}

/**
 * Provides the formatAmount function.
 */
export function formatAmount(amount: number): string {
  if (!amount) return "";
  return niceFraction(amount) ?? String(amount);
}
