import { createSignal } from "solid-js";
import { HeartOff } from "lucide-solid";
import RecipePost from "~/components/home/RecipePost";
import SlideToConfirm from "~/components/common/SlideToConfirm";
import { setRecipeLiked } from "~/queries/likeRecipe";
import type { RecipeFeed } from "~/model/interfaces/RecipeFeed";
import type { UUID } from "~/model/types/UUID";

/**
 * One entry in the dashboard's "Liked Recipes" section (see LikedRecipes.tsx): the
 * same RecipePost card DashboardRecipeCard uses, plus an unlike slider underneath -
 * the counterpart of DashboardRecipeCard's toggle/delete pair, swapped out here
 * because a liked recipe isn't one you own: there's nothing to make private and
 * nothing to delete, only your own like on it to remove.
 *
 * Same SlideToConfirm styling/reasoning as DashboardRecipeCard's delete slider - see
 * that component's KDoc for why it's rendered bare (no intermediate button, no
 * surrounding card) directly on the page background.
 */
export default function LikedRecipeCard(props: {
  recipe: RecipeFeed;
  onUnliked: (id: UUID) => void;
}) {
  const [unliking, setUnliking] = createSignal(false);

  /** Fire-and-forget from SlideToConfirm's point of view - only removes the card from the list on a confirmed success; a failed unlike just re-enables the slider so the user can try again. */
  const confirmUnlike = async () => {
    setUnliking(true);
    // try/catch - a network failure rejects the promise rather than
    // resolving to a value; without this the slider would stay stuck on
    // "Unliking..." forever with no indication anything went wrong.
    try {
      const { ok } = await setRecipeLiked(props.recipe.id, false);
      if (ok) {
        props.onUnliked(props.recipe.id);
      } else {
        setUnliking(false);
      }
    } catch {
      setUnliking(false);
    }
  };

  return (
    <div class="flex flex-col gap-2">
      <RecipePost recipe={props.recipe} />
      <div class="md:w-3/7">
        <SlideToConfirm
          label="Slide to unlike →"
          icon={<HeartOff color="var(--color-background)" class="size-5" />}
          thumbColor="bg-red"
          trackClass="bg-foreground3"
          labelClass="text-background"
          mutedTextClass="text-foreground3"
          disabledReason={() => (unliking() ? "Unliking..." : null)}
          onConfirm={confirmUnlike}
        />
      </div>
    </div>
  );
}
