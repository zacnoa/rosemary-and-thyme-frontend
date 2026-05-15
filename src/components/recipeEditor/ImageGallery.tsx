import { For, JSX } from "solid-js";
import { useRecipe } from "~/hooks/useRecipe";
import { ImageGalleryProps } from "~/model/props/ImageGalleryProps";

export default function ImageGallery(props: ImageGalleryProps) {
  const { recipe, openViewer } = useRecipe()

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
                <img onClick={() => openViewer(props.images, index())} class="h-32 md:h-72 w-auto" src={recipe.images[image].url ?? recipe.images[image].blobURL!} />
              </div>
            )}
          </For>
        </div>
      </div>
      <input id={props.sectionName} class="hidden" type="file" accept=".jpg,.png" onChange={handleChange} />
      <label for={props.sectionName} class="self-start mt-1 px-3 py-1 text-sm md:text-base rounded-md bg-linear-to-r from-green to-orange cursor-pointer">
        + Add Image
      </label>
    </div>
  )
}
