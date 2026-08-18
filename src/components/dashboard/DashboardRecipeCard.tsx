import { createSignal, Show } from "solid-js";
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
 * Starts collapsed as a plain "Delete" button - clicking it expands into the shared
 * slide-to-confirm gesture (see components/common/SlideToConfirm.tsx, also used by
 * the recipe editor's save action) instead of deleting on a single tap, so removing a
 * recipe needs a deliberate two-step action (open the slider, then drag it across)
 * rather than one accidental click. Wrapped in the same dark `bg-foreground` surface
 * as RecipePost itself (rather than sitting straight on the page background) so
 * SlideToConfirm's neutral `bg-background` track still reads as a distinct track
 * against it, the same contrast relationship it has inside the dock's save panel.
 */
export default function DashboardRecipeCard(props: {
  recipe: RecipeFeed;
  onDeleted: (id: UUID) => void;
}) {
  const [expanded, setExpanded] = createSignal(false);
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
      <div class="bg-foreground rounded-md p-3">
        <Show
          when={expanded()}
          fallback={
            <button
              type="button"
              onClick={() => setExpanded(true)}
              class="flex items-center gap-2 px-3 py-1 rounded-md bg-red text-background cursor-pointer text-fluid-sm-base"
            >
              <Trash2 class="size-4" />
              Delete
            </button>
          }
        >
          <SlideToConfirm
            label="Slide to delete →"
            icon={<Trash2 color="var(--color-background)" class="size-5" />}
            thumbColor="bg-red"
            disabledReason={() => (deleting() ? "Deleting..." : null)}
            onConfirm={confirmDelete}
          />
        </Show>
      </div>
    </div>
  );
}
