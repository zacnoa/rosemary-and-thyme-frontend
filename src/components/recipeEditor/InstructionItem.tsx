import { useRecipe } from "./context/useRecipe";
import { resizeTextarea } from "~/utils/resizeTextarea";
import ImageGallery from "./ImageGallery";

/**
 * One instruction step: its (1-based, order-derived - not stored on the
 * instruction itself) step number, text, and attached images.
 *
 * @param id the instruction's id, looked up in the store fresh on every
 * access (`instruction()`/`index()` are plain accessor functions, not
 * values captured once) so this stays correct if steps are reordered/added/
 * removed elsewhere
 */
export default function InstructionItem({ id }: { id: string }) {
  const context = useRecipe();
  const instruction = () => context.recipe.instructions[id];
  const index = () => context.recipe.instructionsOrder.indexOf(id);
  const { addInstructionImage } = context
  let textAreaRef: HTMLTextAreaElement | undefined

  return (
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between md:border-b-3 border-b-2 border-orange">
        <span class="font-bold text-fluid-xl-3xl">{index() + 1}.</span>
        <button
          class="text-red-500 text-fluid-lg-xl cursor-pointer"
          onClick={() => context.removeInstruction(id)}
        >
          ✕
        </button>
      </div>
      <textarea
        ref={textAreaRef}
        class="outline-none resize-none w-full text-fluid-base-lg"
        placeholder="Opisite korak..."
        onInput={(e) => {
          resizeTextarea(textAreaRef)
          context.editInstruction({
            ...instruction(),
            text: e.currentTarget.value
          })
        }}
        spellcheck="false"
      >
        {instruction().text}
      </textarea>
      <ImageGallery sectionName={id} images={instruction().images} addImage={(image) => addInstructionImage(image, id)} />
    </div>
  )
}
