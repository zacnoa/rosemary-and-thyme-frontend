import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { RecipeImage } from "~/model/types/utils";
import { UUID } from "~/model/types/UUID";

type ImageViewerProps = {
  images: UUID[]
  imageMap: Record<UUID, RecipeImage>
  initialIndex?: number,
  onDelete?: (id: UUID) => void
  onClose: () => void
}

/**
 * Fullscreen lightbox for one gallery's images (a recipe's hero images, or
 * one instruction's images - see recipeEditor/ImageGallery.tsx and
 * components/blog/Blog.tsx's own ImageGallery, its two callers). Mounted
 * once at the RecipeProvider/BlogProvider level (not per-gallery) and
 * driven by `viewerImages`/`openViewer`/`closeViewer` on whichever context
 * it's under, so there's only ever one viewer instance regardless of how
 * many galleries are on the page.
 *
 * Deliberately takes `imageMap` as a prop rather than pulling `recipe.images`
 * from useRecipe() itself, so it works the same way under either context -
 * RecipeProvider (editable) or BlogProvider (read-only). `onDelete` is
 * likewise optional: RecipeProvider passes its `removeImage`, BlogProvider
 * passes nothing, which hides the delete button entirely (see below) rather
 * than showing a delete action that isn't allowed in the read-only view.
 *
 * Slides between images via a CSS transform on a flex row (translateX by
 * `activeIndex() * 100%`) rather than swapping which `<img>` is mounted, so
 * every image in the gallery is already in the DOM and the transition is a
 * plain animated slide instead of a cross-fade/pop.
 */
export default function ImageViewer(props: ImageViewerProps) {
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

      {/* images */}
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
                  src={props.imageMap[id]?.url ?? props.imageMap[id]?.blobURL!}
                  onClick={e => e.stopPropagation()}
                />
              </div>
            )}
          </For>
        </div>
      </div>

      {/* prev / next */}
      <button
        class="h-full absolute z-10 left-0.5 md:left-4 top-1/2 -translate-y-1/2 text-foreground text-fluid-3xl-5xl px-2"
        onClick={e => { e.stopPropagation(); prev() }}
      >
        ‹
      </button>
      <button
        class="h-full absolute z-10 right-0.5 md:right-4 top-1/2 -translate-y-1/2 text-foreground text-fluid-3xl-5xl  px-2"
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

      {/* delete button - only shown when the caller allows deleting (RecipeProvider does, BlogProvider doesn't) */}
      <Show when={props.onDelete}>
        {(onDelete) => (
          <button
            class="relative z-10 px-4 py-2 text-fluid-sm-base rounded-md bg-linear-to-r from-green to-orange cursor-pointer"
            onClick={e => { e.stopPropagation(); onDelete()(activeId()) }}
          >
            Delete
          </button>
        )}
      </Show>
    </div>
  )
}
