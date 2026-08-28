import { createSignal } from "solid-js";
import { Trash2 } from "lucide-solid";
import RecipePost from "~/components/home/RecipePost";
import SlideToConfirm from "~/components/common/SlideToConfirm";
import { deleteRecipe } from "~/queries/deleteRecipe";
import type { RecipeFeed } from "~/model/interfaces/RecipeFeed";
import type { UUID } from "~/model/types/UUID";

/**
 * One dashboard entry: the same RecipePost card used on the home feed (see
 * components/home/RecipePost.tsx, untouched), plus a delete control underneath it -
 * the dashboard only ever lists the caller's own recipes (see
 * components/dashboard/RecipeSearch.tsx), so every card here is deletable.
 *
 * The slider (components/common/SlideToConfirm.tsx, also used by the recipe editor's
 * save action) is rendered straight away, with no intermediate "Delete" button and no
 * surrounding background surface - the drag gesture itself is already a deliberate
 * enough action to confirm a delete, so there's no need to gate it behind a second
 * click first. Sitting directly on the page background (rather than wrapped in its
 * own `bg-foreground` card, as it briefly was) needs a bit of care though:
 * SlideToConfirm's default track is `bg-background`, which only reads as a distinct
 * track against some *other* colored surface (e.g. the dock's own panel) - `<html>`
 * itself is `bg-background` (see entry-server.tsx), so directly on the page the
 * default track would blend straight into it. `trackClass`/`labelClass`/
 * `mutedTextClass` below swap it for the more subdued `bg-foreground3` instead -
 * still a visibly distinct track, without a full colored card behind it.
 */
export default function DashboardRecipeCard(props: {
  recipe: RecipeFeed;
  onDeleted: (id: UUID) => void;
}) {
  const [deleting, setDeleting] = createSignal(false);

  /** Fire-and-forget from SlideToConfirm's point of view - only removes the card from the list on a confirmed success; a failed delete just re-enables the slider so the user can try again. */
  const confirmDelete = async () => {
    setDeleting(true);
    const ok = await deleteRecipe(props.recipe.id);
    if (ok) {
      props.onDeleted(props.recipe.id);
    } else {
      setDeleting(false);
    }
  };

  return (
    <div class="flex flex-col gap-2">
      <RecipePost recipe={props.recipe} />
      {/*
        md:w-1/4 - on a wide screen the full-width slider left a lot of empty track to
        drag across for what's otherwise a small control; capped down to about a
        quarter of the card's width there. Full-width below `md:` (mobile), where the
        card itself is already narrow and a quartered slider would be uncomfortably
        small to drag accurately.
      */}
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
