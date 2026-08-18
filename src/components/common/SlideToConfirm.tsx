import { JSX, createSignal, Show } from "solid-js";

/**
 * Fraction of the track's draggable range the thumb must cross before releasing
 * counts as a confirmed slide, not an accidental tap/short drag - see [onPointerUp].
 */
const CONFIRM_THRESHOLD = 0.85;

/**
 * The thumb's resting inset from the track's edge - matches the `top-1 left-1` (4px)
 * Tailwind classes on the thumb below, and the `+ 4` added to `offsetPx()` in its
 * `style.left`. Subtracted from *both* sides when computing [maxOffset] so the thumb
 * ends its drag with the same 4px gap from the track's right edge that it starts with
 * on the left - without this, the fully-dragged thumb's right edge lands 4px past the
 * track's own right edge (only the track's `overflow-hidden` was hiding that as a
 * clipped, flattened-looking circle instead of a full round thumb sitting flush
 * inside the track).
 */
const THUMB_INSET_PX = 4;

type SlideToConfirmProps = {
  /** Text shown centered on the track, e.g. "Slide to save →" / "Slide to delete →". */
  label: string;
  /** Rendered inside the thumb, already sized/colored for it (e.g. `<Save class="size-5" color="var(--color-background)" />`). */
  icon: JSX.Element;
  /** Tailwind `bg-*` class for the thumb while enabled/draggable - the only thing that visually distinguishes one use of this component from another (e.g. `"bg-green"` for save, `"bg-red"` for delete). */
  thumbColor: string;
  /** The first reason the slide can't be completed right now, or `null` if it can - shown under the track, and disables dragging entirely while set. */
  disabledReason: () => string | null;
  /** Called once, on a successful release past [CONFIRM_THRESHOLD] - fire-and-forget from this component's point of view, the thumb always snaps back to the start shortly after regardless of the outcome. */
  onConfirm: () => void;
};

/**
 * A "slide to confirm" gesture: drag a thumb across a track instead of tapping a
 * plain button, so confirming a consequential action needs a deliberate drag rather
 * than a single tap that's easy to trigger by accident. Originally built just for
 * saving a recipe, now shared between that (components/dock/modules/SaveModule.tsx)
 * and deleting one from the dashboard (components/dashboard/DashboardRecipeCard.tsx) -
 * the two differ only in [label]/[icon]/[thumbColor]/[disabledReason]/[onConfirm],
 * everything about the drag mechanics below is identical either way.
 *
 * Dragging is driven entirely by pointer events on the thumb itself
 * (`onPointerDown`/`onPointerMove`/`onPointerUp`, using `setPointerCapture` so the
 * drag keeps tracking the pointer even once it leaves the thumb's own bounds) rather
 * than a native `<input type="range">` - this isn't really "pick a value", it's
 * "perform a confirm gesture", which a range input doesn't model well (its value
 * would need resetting after every use, and there's no natural way to distinguish
 * "let go early" from "completed the gesture").
 */
export default function SlideToConfirm(props: SlideToConfirmProps) {
  const [offsetPx, setOffsetPx] = createSignal(0);
  const [dragging, setDragging] = createSignal(false);

  let trackRef: HTMLDivElement | undefined;
  let thumbRef: HTMLDivElement | undefined;
  let maxOffset = 0;
  let startX = 0;
  let startOffset = 0;

  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

  const onPointerDown = (e: PointerEvent) => {
    if (props.disabledReason() || !trackRef || !thumbRef) return;

    maxOffset = trackRef.clientWidth - thumbRef.clientWidth - THUMB_INSET_PX * 2;
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
      props.onConfirm();
      setTimeout(() => setOffsetPx(0), 400); // reset for next time; outcome is communicated by the caller, not this slider
    } else {
      setOffsetPx(0); // didn't drag far enough - snap back, nothing confirmed
    }
  };

  return (
    <div class="flex flex-col gap-2">
      <div
        ref={trackRef}
        class={`relative h-12 rounded-full bg-background overflow-hidden ${props.disabledReason() ? "opacity-50" : ""
          }`}
      >
        <p class="absolute inset-0 flex items-center justify-center text-foreground text-fluid-sm-base pointer-events-none select-none">
          {props.label}
        </p>
        <div
          ref={thumbRef}
          class={`absolute top-1 left-1 size-10 rounded-full flex items-center justify-center touch-none ${props.disabledReason()
            ? "bg-foreground cursor-not-allowed"
            : `${props.thumbColor} cursor-grab active:cursor-grabbing`
            } ${dragging() ? "" : "transition-[left] duration-300"}`}
          style={{ left: `${offsetPx() + 4}px` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          {props.icon}
        </div>
      </div>
      <Show when={props.disabledReason()}>
        <p class="text-background text-fluid-xs-sm opacity-80">{props.disabledReason()}</p>
      </Show>
    </div>
  );
}
