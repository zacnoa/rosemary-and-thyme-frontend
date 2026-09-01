import { createSignal, For, JSX, Show } from "solid-js";
import { RecipeImage } from "~/model/types/utils";
import { UUID } from "~/model/types/UUID";
import { useRecipe } from "./context/useRecipe";
import DeleteImageModal from "./DeleteImageModal";

export type ImageGalleryProps = {
  images: UUID[],
  sectionName: string
  addImage: (image: RecipeImage, ...args: unknown[]) => void
}

/**
 * A horizontally-scrolling strip of images (used for both the recipe's hero
 * banner and an individual instruction step's images) plus an "add image"
 * file picker. Clicking any image opens DeleteImageModal for just that one
 * image - there's no gallery/lightbox view any more, a click is a direct
 * route to "delete this image?".
 *
 * `deleteTarget` is local state, not shared via RecipeContext (unlike the old
 * ImageViewer, which was mounted once at RecipeProvider's level) - the old
 * viewer needed to be centralized because it could browse *across* whichever
 * gallery opened it, so every gallery had to funnel into the same shared
 * instance. DeleteImageModal never browses between images at all (one image
 * in, one delete/cancel decision out), so there's nothing left for a shared
 * instance to coordinate - each gallery can just own its own "is a delete
 * confirm open, and for which image" state, and call RecipeContext's
 * `removeImage` (the one piece of actual shared mutation) directly on confirm.
 * `position: fixed` on the modal itself means nesting it here instead of at
 * the page root has no visual effect either way.
 *
 * `props.sectionName` doubles as both a unique `id`/`for` pair linking the
 * hidden `<input type="file">` to its label button, and (via
 * `addInstructionImage`) which instruction an image picked here belongs to
 * - see InstructionItem.tsx, which passes the instruction's own id.
 *
 * @param props.addImage typically RecipeProvider's addBannerImage or a
 * per-instruction `addInstructionImage` partial (see InstructionItem.tsx) -
 * *not* `saveRecipe`; a picked file is only staged into the store here, the
 * actual upload happens on the next save (see RecipeProvider.saveRecipe)
 */
export default function ImageGallery(props: ImageGalleryProps) {
  const { recipe, removeImage } = useRecipe()
  const [deleteTarget, setDeleteTarget] = createSignal<UUID | null>(null);

  /**
   * Stages a freshly-picked file: gives it a client-generated id and an
   * object URL (`blobURL`) for an immediate local preview, with `url: null`
   * since it hasn't been uploaded to Cloudinary yet - see model/types/utils.ts's
   * RecipeImage for the full url/blob/blobURL split, and
   * RecipeProvider.saveRecipe for where `blob` actually gets uploaded.
   */
  const handleChange: JSX.EventHandler<HTMLInputElement, Event> = (e) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    const blobURL = URL.createObjectURL(file);
    props.addImage({ id: crypto.randomUUID(), url: null, blob: file, blobURL: blobURL })
  }

  return (
    <div class="flex flex-col gap-y-4"  >
      <div class="w-full overflow-x-auto">
        <div class="flex flex-row gap-4" style="width: max-content">
          <For each={props.images}>
            {(image) => (
              <div class="shrink-0">
                {/* url (the persisted Cloudinary url) wins once it exists; blobURL is only a stand-in for images picked but not yet saved */}
                <img
                  onClick={() => setDeleteTarget(image)}
                  class="h-32 md:h-72 w-auto cursor-pointer"
                  src={recipe.images[image].url ?? recipe.images[image].blobURL!}
                />
              </div>
            )}
          </For>
        </div>
      </div>
      <input id={props.sectionName} class="hidden" type="file" accept=".jpg,.png" onChange={handleChange} />
      <label for={props.sectionName} class="self-start mt-1 px-3 py-1 text-fluid-sm-base rounded-md bg-linear-to-r from-green to-orange cursor-pointer">
        + Add Image
      </label>

      <Show when={deleteTarget()}>
        {(id) => (
          <DeleteImageModal
            image={recipe.images[id()]}
            onConfirm={() => removeImage(id())}
            onClose={() => setDeleteTarget(null)}
          />
        )}
      </Show>
    </div>
  )
}
