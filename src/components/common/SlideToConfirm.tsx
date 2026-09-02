import { JSX, createSignal, Show } from "solid-js";

/**
 * Sets the drag distance required to confirm an action.
 */
const CONFIRM_THRESHOLD = 0.85;

/**
 * Sets the thumb inset used by the drag track.
 */
const THUMB_INSET_PX = 4;

type SlideToConfirmProps = {
  label: string;
  icon: JSX.Element;
  thumbColor: string;
  disabledReason: () => string | null;
  onConfirm: () => void;
  trackClass?: string;
  labelClass?: string;
  mutedTextClass?: string;
};

/**
 * Confirms an action through a deliberate drag gesture.
 */
export default function SlideToConfirm(props: SlideToConfirmProps) {
  const trackClass = () => props.trackClass ?? "bg-background";
  const labelClass = () => props.labelClass ?? "text-foreground";
  const mutedTextClass = () => props.mutedTextClass ?? "text-background";

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
        class={`relative h-12 rounded-full ${trackClass()} overflow-hidden ${props.disabledReason() ? "opacity-50" : ""
          }`}
      >
        <p class={`absolute inset-0 flex items-center justify-center ${labelClass()} text-sm md:text-base pointer-events-none select-none`}>
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
        <p class={`${mutedTextClass()} text-xs md:text-sm opacity-80`}>{props.disabledReason()}</p>
      </Show>
    </div>
  );
}
