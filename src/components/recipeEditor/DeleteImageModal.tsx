import { onCleanup, onMount, Show } from "solid-js";
import { Trash2, X } from "lucide-solid";
import SlideToConfirm from "~/components/common/SlideToConfirm";
import { RecipeImage } from "~/model/types/utils";

type DeleteImageModalProps = {
  /**
   * `undefined` for one instant on a confirmed delete: `onConfirm` removes the
   * image from the store synchronously, before the caller's own state update that
   * unmounts this modal is processed - the `<Show>` below covers that gap instead
   * of reading `.url` off a value that's already gone.
   */
  image: RecipeImage | undefined;
  onConfirm: () => void;
  onClose: () => void;
};

/**
 * Fullscreen "delete this image?" confirmation for exactly one image - no
 * gallery/browsing, just that image plus a `SlideToConfirm` to delete it.
 * Rendered by ImageGallery, which owns the open/closed state and passes its own
 * `removeImage` as `onConfirm`.
 *
 * `trackClass`/`labelClass`/`mutedTextClass` on the slider match
 * DashboardRecipeCard's delete slider - both sit directly on a blurred backdrop,
 * not a solid card, so `SlideToConfirm`'s default `bg-background` track would
 * otherwise blend straight into it.
 *
 * Three equivalent ways to close without deleting: the X button, the backdrop, or
 * Escape - the image and the slider both `stopPropagation` so interacting with
 * either doesn't also trigger the backdrop's close.
 */
export default function DeleteImageModal(props: DeleteImageModalProps) {
  const confirmDelete = () => {
    props.onConfirm();
    props.onClose();
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") props.onClose();
  };

  onMount(() => window.addEventListener("keydown", onKey));
  onCleanup(() => window.removeEventListener("keydown", onKey));

  return (
    <div class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 px-4" onClick={props.onClose}>
      {/* overlay */}
      <div class="absolute inset-0 bg-background/60 backdrop-blur-md" />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          props.onClose();
        }}
        class="absolute z-10 top-4 right-4 md:top-6 md:right-6 text-foreground cursor-pointer"
        aria-label="Close"
      >
        <X class="size-8" />
      </button>

      {/* url (the persisted Cloudinary url) wins once it exists; blobURL is only a stand-in for an image picked but not yet saved */}
      <Show when={props.image}>
        {(image) => (
          <img
            class="relative z-10 max-h-[55vh] md:max-h-[65vh] w-auto max-w-9/10 rounded-xl object-contain"
            src={image().url ?? image().blobURL!}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </Show>

      <div class="relative z-10 w-full md:w-1/2" onClick={(e) => e.stopPropagation()}>
        <SlideToConfirm
          label="Slide to delete image →"
          icon={<Trash2 color="var(--color-background)" class="size-5" />}
          thumbColor="bg-red"
          trackClass="bg-foreground3"
          labelClass="text-background"
          mutedTextClass="text-foreground3"
          disabledReason={() => null}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
}
