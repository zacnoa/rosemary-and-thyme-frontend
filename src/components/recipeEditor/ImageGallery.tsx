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
 * Displays recipe images and handles image selection and deletion.
 */
export default function ImageGallery(props: ImageGalleryProps) {
  const { recipe, removeImage } = useRecipe()
  const [deleteTarget, setDeleteTarget] = createSignal<UUID | null>(null);

  /**
 * Provides the handleChange function.
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
      <label for={props.sectionName} class="self-start mt-1 px-3 py-1 text-sm md:text-base rounded-md bg-linear-to-r from-green to-orange cursor-pointer">
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
