import { Save } from "lucide-solid";
import { onMount } from "solid-js";
import { useDock } from "../context/DockContext";
import { useRecipe } from "~/components/recipeEditor/context/useRecipe";
import SlideToConfirm from "~/components/common/SlideToConfirm";

const PANEL_ID = "save";

/**
 * The dock's save panel content: wraps the shared slide-to-confirm gesture (see
 * components/common/SlideToConfirm.tsx) with recipe-specific bits.
 *
 * [context.saveRecipe] is only ever called once, on a *successful* release - the call
 * itself is fire-and-forget from this component's point of view: the thumb always
 * snaps back to the start shortly after, and the actual outcome (in flight /
 * succeeded / failed) is communicated separately via the NotificationModal toast that
 * RecipeProvider.saveRecipe drives, not by anything in this panel.
 *
 * Whenever there's nothing valid to save - `changedFlag()` is false, or
 * [context.saveBlockers] reports a limit violation - [disabledReason] reports that,
 * which SlideToConfirm renders disabled (dimmed, thumb ignores pointer events) with
 * the reason printed underneath, so the user finds out *why* before attempting the
 * gesture at all rather than only after dragging all the way across.
 * RecipeProvider.saveRecipe enforces the exact same two checks again on its own, so
 * this is a convenience gate, not the only thing preventing an invalid save.
 */
function SaveSlider() {
  const context = useRecipe();

  /** The first reason the slide can't be completed right now, or `null` if it can. */
  const disabledReason = (): string | null => {
    if (!context.changedFlag()) return "Nothing to save yet";
    const blockers = context.saveBlockers();
    return blockers.length > 0 ? blockers[0] : null;
  };

  return (
    <SlideToConfirm
      label="Slide to save →"
      icon={<Save color="var(--color-background)" class="size-5" />}
      thumbColor="bg-green"
      disabledReason={disabledReason}
      onConfirm={() => context.saveRecipe(context.recipe)}
    />
  );
}

/**
 * Dock module for saving. No longer saves directly on tap (see [SaveSlider]
 * for why) - clicking this `<li>` just opens/closes its panel, the same
 * `registerPanel`/`toggle` mechanism every other dock module uses. Still
 * turns green while `context.changedFlag()` is set, same as before, now as
 * a hint that there's something worth opening the panel for rather than a
 * direct save trigger.
 */
export default function SaveButton() {
  const context = useRecipe();
  const { toggle, activePanel, registerPanel } = useDock();

  onMount(() => {
    registerPanel(PANEL_ID, () => <SaveSlider />);
  });

  return (
    <li
      class={`rounded-md p-1 cursor-pointer ${activePanel() === PANEL_ID
        ? "bg-purple"
        : context.changedFlag() ? "bg-green" : "bg-foreground"
        }`}
      onClick={() => toggle(PANEL_ID)}
    >
      <Save color="var(--color-background)" class="md:w-[30px] h-auto" />
    </li>
  );
}
