/**
 * Parses a recipe ingredient's typed amount into a plain number, accepting
 * either a decimal ("1.5", "1,5") or a simple proper fraction ("3/4", "1/2").
 * Fraction support matters because a later feature (scaling a recipe's
 * portions up/down) needs to do arithmetic on `amount`, which only works if
 * it's stored as a number - not as whatever string shape the user happened
 * to type it in.
 *
 * @returns the parsed value, or `undefined` if `raw` isn't (yet) a complete,
 * valid amount - e.g. mid-typing a fraction ("3/"), a "x/0" divide-by-zero,
 * or plain garbage. Callers should treat `undefined` as "not ready to commit
 * yet", not as an error - see Ingredient.tsx's local `amountText` buffer:
 * an amount input can't commit to the store on every keystroke the way
 * name/measuringUnit do, since some in-progress keystrokes (the "/" in
 * "3/4") are never themselves a valid number on their own.
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
 * Denominators [niceFraction] will try, in preference order (simplest
 * first) - covers the fractions actually seen in recipes (halves, thirds,
 * quarters, eighths). Deliberately not exhaustive: an arbitrary denominator
 * (e.g. "7/9") would technically round-trip too, but would no longer read
 * as a fraction anyone actually measures by.
 */
const NICE_FRACTION_DENOMINATORS = [2, 3, 4, 8];

/**
 * How far `amount` is allowed to sit from `numerator/denominator` and still
 * count as "is" that fraction - absorbs ordinary float imprecision (e.g. a
 * stored 0.3333333333333333 for what was typed as "1/3").
 */
const NICE_FRACTION_TOLERANCE = 0.01;

/**
 * Finds a simple fraction that `amount` is (close enough to being) equal to,
 * trying [NICE_FRACTION_DENOMINATORS] in order and returning the first hit -
 * e.g. `0.75` -> `"3/4"`. Only ever attempted for `0 < amount < 1`: whole
 * amounts don't need it, and amounts of 1 or more are left as plain decimals
 * rather than turned into an improper fraction ("3/2") or a mixed number
 * ("1 1/2") - [parseAmount] doesn't understand either of those shapes, so
 * producing one here would create a value this same input can't parse back.
 *
 * @returns the fraction as text, or `undefined` if no denominator in
 * [NICE_FRACTION_DENOMINATORS] lands within [NICE_FRACTION_TOLERANCE].
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
 * Formats a stored amount back into editable text - the inverse of
 * [parseAmount], used to seed Ingredient.tsx's local text buffer from the
 * store (initially, and again on blur if the user leaves an unparsable
 * value behind). Amounts under 1 that are (close to) a common cooking
 * fraction round-trip back as that fraction (`0.75` -> `"3/4"`) via
 * [niceFraction], so a recipe saved from a typed "3/4" shows the same "3/4"
 * next time it's opened instead of "0.75" - everything else (whole numbers,
 * amounts of 1 or more, or decimals with no nearby nice fraction) is shown
 * as a plain decimal.
 */
export function formatAmount(amount: number): string {
  if (!amount) return "";
  return niceFraction(amount) ?? String(amount);
}
