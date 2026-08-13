import { Save } from "lucide-solid";
import { createSignal, onMount, Show } from "solid-js";
import { useDock } from "../context/DockContext";
import { useRecipe } from "~/components/recipeEditor/context/useRecipe";

const PANEL_ID = "save";

/**
 * Fraction of the track's draggable range the thumb must cross before
 * releasing counts as a confirmed "slide to save", not an accidental
 * tap/short drag - see [SaveSlider.onPointerUp].
 */
const CONFIRM_THRESHOLD = 0.85;

/**
 * The dock's save panel content: a "slide to save" gesture instead of a
 * plain button, so saving needs a deliberate drag across the track rather
 * than a single tap that's easy to trigger by accident (e.g. reaching past
 * it for a neighboring dock icon).
 *
 * Dragging is driven entirely by pointer events on the thumb itself
 * (`onPointerDown`/`onPointerMove`/`onPointerUp`, using
 * `setPointerCapture` so the drag keeps tracking the pointer even once it
 * leaves the thumb's own bounds) rather than a native `<input type="range">` -
 * this isn't really "pick a value", it's "perform a confirm gesture", which
 * a range input doesn't model well (its value would need resetting after
 * every use, and there's no natural way to distinguish "let go early" from
 * "completed the gesture").
 *
 * [context.saveRecipe] is only ever called once, on a *successful* release
 * (past [CONFIRM_THRESHOLD]) - the call itself is fire-and-forget from this
 * component's point of view: the thumb always snaps back to the start
 * shortly after, and the actual outcome (in flight / succeeded / failed) is
 * communicated separately via the NotificationModal toast that
 * RecipeProvider.saveRecipe drives, not by anything in this panel.
 *
 * Whenever there's nothing valid to save - `changedFlag()` is false, or
 * [context.saveBlockers] reports a limit violation - the track is rendered
 * disabled (dimmed, thumb ignores pointer events) with the reason printed
 * underneath, so the user finds out *why* before attempting the gesture at
 * all rather than only after dragging all the way across. RecipeProvider.saveRecipe
 * enforces the exact same two checks again on its own, so this is a
 * convenience gate, not the only thing preventing an invalid save.
 */
function SaveSlider() {
  const context = useRecipe();
  const [offsetPx, setOffsetPx] = createSignal(0);
  const [dragging, setDragging] = createSignal(false);

  let trackRef: HTMLDivElement | undefined;
  let thumbRef: HTMLDivElement | undefined;
  let maxOffset = 0;
  let startX = 0;
  let startOffset = 0;

  /** The first reason the slide can't be completed right now, or `null` if it can. */
  const disabledReason = (): string | null => {
    if (!context.changedFlag()) return "Nothing to save yet";
    const blockers = context.saveBlockers();
    return blockers.length > 0 ? blockers[0] : null;
  };

  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

  const onPointerDown = (e: PointerEvent) => {
    if (disabledReason() || !trackRef || !thumbRef) return;

    maxOffset = trackRef.clientWidth - thumbRef.clientWidth;
    startX = e.clientX;
    startOffset = offsetPx();
    setDragging(true);
    thumbRef.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!dragging()) return;
    setOffsetPx(clamp(startOffset + (e.clientX - startX), 0, maxOffset));
  };

  const onPointerUp = () => {
    if (!dragging()) return;
    setDragging(false);

    const ratio = maxOffset > 0 ? offsetPx() / maxOffset : 0;
    if (ratio >= CONFIRM_THRESHOLD) {
      setOffsetPx(maxOffset); // snap the rest of the way - confirms the gesture visually
      context.saveRecipe(context.recipe);
      setTimeout(() => setOffsetPx(0), 400); // reset for next time; save's outcome is shown via NotificationModal, not this slider
    } else {
      setOffsetPx(0); // didn't drag far enough - snap back, nothing is saved
    }
  };

  return (
    <div class="flex flex-col gap-2">
      <div
        ref={trackRef}
        class={`relative h-12 rounded-full bg-background overflow-hidden ${disabledReason() ? "opacity-50" : ""
          }`}
      >
        <p class="absolute inset-0 flex items-center justify-center text-foreground text-fluid-sm-base pointer-events-none select-none">
          Slide to save →
        </p>
        <div
          ref={thumbRef}
          class={`absolute top-1 left-1 size-10 rounded-full flex items-center justify-center touch-none ${disabledReason() ? "bg-foreground cursor-not-allowed" : "bg-green cursor-grab active:cursor-grabbing"
            } ${dragging() ? "" : "transition-[left] duration-300"}`}
          style={{ left: `${offsetPx() + 4}px` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <Save color="var(--color-background)" class="size-5" />
        </div>
      </div>
      <Show when={disabledReason()}>
        <p class="text-background text-fluid-xs-sm opacity-80">{disabledReason()}</p>
      </Show>
    </div>
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
