import { For, JSX } from "solid-js";
import { RecipeImage } from "~/model/types/utils";
import { UUID } from "~/model/types/UUID";
import { useRecipe } from "./context/useRecipe";

export type ImageGalleryProps = {
  images: UUID[],
  sectionName: string
  addImage: (image: RecipeImage, ...args: unknown[]) => void
}

/**
 * A horizontally-scrolling strip of images (used for both the recipe's hero
 * banner and an individual instruction step's images) plus an "add image"
 * file picker. Clicking any image (or the strip itself) opens the shared
 * ImageViewer over this gallery's own `props.images` list.
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
  const { recipe, openViewer } = useRecipe()

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
      <div class="w-full overflow-x-auto cursor-pointer" onClick={() => openViewer(props.images)}>
        <div class="flex flex-row gap-4" style="width: max-content">
          <For each={props.images}>
            {(image, index) => (
              <div class="shrink-0">
                {/* url (the persisted Cloudinary url) wins once it exists; blobURL is only a stand-in for images picked but not yet saved */}
                <img onClick={() => openViewer(props.images, index())} class="h-32 md:h-72 w-auto" src={recipe.images[image].url ?? recipe.images[image].blobURL!} />
              </div>
            )}
          </For>
        </div>
      </div>
      <input id={props.sectionName} class="hidden" type="file" accept=".jpg,.png" onChange={handleChange} />
      <label for={props.sectionName} class="self-start mt-1 px-3 py-1 text-fluid-sm-base rounded-md bg-linear-to-r from-green to-orange cursor-pointer">
        + Add Image
      </label>
    </div>
  )
}
