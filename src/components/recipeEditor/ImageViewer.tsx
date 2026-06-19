import { createSignal, For, onCleanup, onMount } from "solid-js";
import { useRecipe } from "./context/useRecipe";

type ImageViewerProps = {
  images: string[]
  initialIndex?: number,
  onDelete: (id: string) => void
  onClose: () => void
}

export default function ImageViewer(props: ImageViewerProps) {
  const { recipe } = useRecipe()
  const [activeIndex, setActiveIndex] = createSignal(props.initialIndex ?? 0)

  const next = () => setActiveIndex(i => Math.min(i + 1, props.images.length - 1))
  const prev = () => setActiveIndex(i => Math.max(i - 1, 0))
  const activeId = () => props.images[activeIndex()]

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") props.onClose()
    if (e.key === "ArrowRight") next()
    if (e.key === "ArrowLeft") prev()
  }

  onMount(() => window.addEventListener("keydown", onKey))
  onCleanup(() => window.removeEventListener("keydown", onKey))

  return (
    <div
      class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3"
      onClick={props.onClose}
    >
      {/* overlay */}
      <div class="absolute inset-0 bg-background/60 backdrop-blur-md" />

      {/* slike */}
      <div class="relative z-10 overflow-hidden w-full pointer-events-none">
        <div
          class="flex transition-transform duration-300"
          style={{ transform: `translateX(-${activeIndex() * 100}%)` }}
        >
          <For each={props.images}>
            {(id) => (
              <div class="shrink-0 w-full flex justify-center px-4 md:px-16">
                <img
                  class="max-h-[60vh] md:max-h-[75vh] w-auto max-w-9/10 rounded-xl object-contain pointer-events-auto"
                  src={recipe.images[id]?.url ?? recipe.images[id]?.blobURL!}
                  onClick={e => e.stopPropagation()}
                />
              </div>
            )}
          </For>
        </div>
      </div>

      {/* prev / next */}
      <button
        class="h-full absolute z-10 left-0.5 md:left-4 top-1/2 -translate-y-1/2 text-foreground text-3xl md:text-5xl px-2"
        onClick={e => { e.stopPropagation(); prev() }}
      >
        ‹
      </button>
      <button
        class="h-full absolute z-10 right-0.5 md:right-4 top-1/2 -translate-y-1/2 text-foreground text-3xl md:text-5xl  px-2"
        onClick={e => { e.stopPropagation(); next() }}
      >
        ›
      </button>

      {/* dots */}
      <div
        class="relative z-10 flex gap-2"
        onClick={e => e.stopPropagation()}
      >
        <For each={props.images}>
          {(_, i) => (
            <div
              class={`w-2 h-2 rounded-full transition-all cursor-pointer ${activeIndex() === i() ? "bg-foreground scale-125" : "bg-foreground/40"}`}
              onClick={() => setActiveIndex(i())}
            />
          )}
        </For>
      </div>

      {/* delete button */}
      <button
        class="relative z-10 px-4 py-2 text-sm md:text-base rounded-md bg-linear-to-r from-green to-orange cursor-pointer"
        onClick={e => { e.stopPropagation(); props.onDelete(activeId()) }}
      >
        Delete
      </button>
    </div>
  )
}
