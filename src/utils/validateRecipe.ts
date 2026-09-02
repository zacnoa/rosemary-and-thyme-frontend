import { Recipe } from "~/model/interfaces/Recipe";

/**
 * Sets the maximum number of ingredients allowed in a recipe.
 */
export const MAX_INGREDIENTS = 50;
export const MAX_INSTRUCTIONS = 50;
export const MAX_DESCRIPTION_WORDS = 1000;
export const MAX_NAME_CHARS = 100;

/**
 * Provides the wordCount function.
 */
const wordCount = (text: string) => {
  const trimmed = text.trim();
  return trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
};

/**
 * Provides the getSaveBlockers function.
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
