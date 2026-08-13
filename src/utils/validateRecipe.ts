import { Recipe } from "~/model/interfaces/Recipe";

/**
 * Recipe-level limits enforced before a save is allowed - see
 * [getSaveBlockers]. Mirrored on the backend by RecipeValidation.kt (see
 * RecipeService.saveRecipe, which is the check that actually matters - this
 * client-side one only makes the slide-to-save panel fail fast/explain
 * itself before a request is even sent). Keep the numbers here and there in
 * sync if either changes.
 */
export const MAX_INGREDIENTS = 50;
export const MAX_INSTRUCTIONS = 50;
export const MAX_DESCRIPTION_WORDS = 1000;
export const MAX_NAME_CHARS = 100;

/** Whitespace-delimited word count, ignoring leading/trailing/duplicate whitespace. */
const wordCount = (text: string) => {
  const trimmed = text.trim();
  return trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
};

/**
 * Checks recipe-level limits that must hold before a save is attempted, and
 * returns a list of human-readable reasons the save should be blocked - an
 * empty list means the recipe is within every limit.
 *
 * Used by both RecipeProvider.saveRecipe (the actual gate - a save is
 * refused entirely if this is non-empty) and SaveModule's slider panel
 * (which disables the drag gesture and shows the reason up front, rather
 * than only failing after the user completes the swipe).
 *
 * @param recipe the recipe to validate
 * @returns blocking reasons, in check order - the first one is what
 * saveRecipe's error toast actually shows when there's more than one
 */
export const getSaveBlockers = (recipe: Recipe): string[] => {
  const blockers: string[] = [];

  if (recipe.ingredientsOrder.length > MAX_INGREDIENTS) {
    blockers.push(`Too many ingredients (max ${MAX_INGREDIENTS})`);
  }
  if (recipe.instructionsOrder.length > MAX_INSTRUCTIONS) {
    blockers.push(`Too many steps (max ${MAX_INSTRUCTIONS})`);
  }
  if (wordCount(recipe.description) > MAX_DESCRIPTION_WORDS) {
    blockers.push(`Description too long (max ${MAX_DESCRIPTION_WORDS} words)`);
  }
  if (recipe.name.length > MAX_NAME_CHARS) {
    blockers.push(`Title too long (max ${MAX_NAME_CHARS} characters)`);
  }

  return blockers;
};
