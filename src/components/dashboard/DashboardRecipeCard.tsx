import { createSignal, Show } from "solid-js";
import { Lock, LockOpen, Trash2 } from "lucide-solid";
import RecipePost from "~/components/home/RecipePost";
import SlideToConfirm from "~/components/common/SlideToConfirm";
import { deleteRecipe } from "~/queries/deleteRecipe";
import { setRecipePrivate } from "~/queries/setRecipePrivate";
import { useNotification } from "~/components/notification/context/useNotification";
import type { RecipeFeed } from "~/model/interfaces/RecipeFeed";
import type { UUID } from "~/model/types/UUID";

/**
 * One "My Recipes" dashboard card: RecipePost plus a private/public toggle and a
 * delete slider. Rendered by components/dashboard/RecipeSearch.tsx, one per recipe
 * the caller owns - the "Liked Recipes" counterpart is LikedRecipeCard, which swaps
 * this pair for a single unlike slider (a liked recipe isn't yours to toggle/delete).
 *
 * `onDeleted`/`onPrivacyChange` don't touch the store themselves - they report a
 * confirmed server-side change back to the caller, which owns the actual list.
 *
 * The delete slider sits straight on the page background, not a card - its default
 * `bg-background` track would blend into `<html>` (also `bg-background`, see
 * entry-server.tsx), hence the `trackClass`/`labelClass`/`mutedTextClass` overrides
 * to the more subdued `bg-foreground3` below.
 */
export default function DashboardRecipeCard(props: {
  recipe: RecipeFeed;
  onDeleted: (id: UUID) => void;
  onPrivacyChange: (id: UUID, isPrivate: boolean) => void;
}) {
  const [deleting, setDeleting] = createSignal(false);
  const [togglingPrivate, setTogglingPrivate] = createSignal(false);
  const { notify } = useNotification();

  /** Fire-and-forget from SlideToConfirm's point of view - only removes the card from the list on a confirmed success; a failed delete just re-enables the slider so the user can try again. */
  const confirmDelete = async () => {
    setDeleting(true);
    // try/catch - a network failure rejects the promise rather than resolving
    // to false; without this the slider would stay stuck on "Deleting..."
    // forever with no indication anything went wrong.
    try {
      const ok = await deleteRecipe(props.recipe.id);
      if (ok) {
        props.onDeleted(props.recipe.id);
      } else {
        setDeleting(false);
      }
    } catch {
      setDeleting(false);
      notify("error", "Could not reach the server - check your connection and try again");
    }
  };

  /**
   * Flips this recipe's private/public flag via `PATCH /recipe/{id}/private`.
   * Waits for the request to confirm before updating anything - unlike
   * confirmDelete's card removal, there's no harmless "undo" for an optimistic
   * flip that turns out wrong, so a failure just leaves the toggle as it was and
   * surfaces a toast instead.
   */
  const togglePrivate = async () => {
    if (togglingPrivate()) return;
    setTogglingPrivate(true);
    const next = !props.recipe.isPrivate;

    // try/finally - a network failure rejects the promise rather than
    // resolving to false; without this the toggle would stay stuck on
    // "Updating..." forever with no indication anything went wrong.
    try {
      const ok = await setRecipePrivate(props.recipe.id, next);
      if (ok) {
        props.onPrivacyChange(props.recipe.id, next);
      } else {
        notify("error", "Could not update recipe visibility");
      }
    } catch {
      notify("error", "Could not reach the server - check your connection and try again");
    } finally {
      setTogglingPrivate(false);
    }
  };

  return (
    <div class="flex flex-col gap-2">
      <RecipePost recipe={props.recipe} />
      <button
        type="button"
        disabled={togglingPrivate()}
        onClick={togglePrivate}
        class="self-start flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-foreground3 text-foreground3 text-fluid-xs-sm cursor-pointer disabled:opacity-50"
      >
        <Show when={props.recipe.isPrivate} fallback={<LockOpen class="size-4" />}>
          <Lock class="size-4" />
        </Show>
        {togglingPrivate()
          ? "Updating..."
          : props.recipe.isPrivate
            ? "Private - tap to make public"
            : "Public - tap to make private"}
      </button>
      {/* md:w-3/7 - full-width on mobile (card is already narrow there), capped down on wider screens so the slider isn't a long empty drag for a small control. */}
      <div class="md:w-3/7">
        <SlideToConfirm
          label="Slide to delete →"
          icon={<Trash2 color="var(--color-background)" class="size-5" />}
          thumbColor="bg-red"
          trackClass="bg-foreground3"
          labelClass="text-background"
          mutedTextClass="text-foreground3"
          disabledReason={() => (deleting() ? "Deleting..." : null)}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
}
