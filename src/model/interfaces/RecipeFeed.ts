import { UUID } from "../types/UUID";

/**
 * One feed card's worth of data for the home page's global recipe browser - a
 * lighter projection of `Recipe` (see model/interfaces/Recipe.ts) mirroring the
 * backend's RecipeFeedDTO, without any of the ingredient/instruction/full-image data
 * a feed card has no use for.
 *
 * `createDate` arrives over the wire as an ISO string, converted to a real `Date` in
 * queries/searchAllRecipes.ts before this shape is used - same convention as `Recipe`.
 *
 * @property heroImageUrl the recipe's first hero image, or `null` if it has none -
 * see components/home/RecipePost.tsx, which simply omits the image in that case
 * @property isPrivate mirrors the backend's `RecipeDTO.isPrivate` - only ever `true`
 * on a card from the dashboard's own-recipes feed (the global feed excludes private
 * recipes server-side), used by DashboardRecipeCard to render its private/public toggle
 */
export interface RecipeFeed {
  id: UUID;
  name: string;
  description: string;
  likes: number;
  userName: string;
  createDate: Date;
  heroImageUrl: string | null;
  isPrivate: boolean;
}
