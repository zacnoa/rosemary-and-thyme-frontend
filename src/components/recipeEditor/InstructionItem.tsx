import { onMount } from "solid-js";
import { useRecipe } from "~/hooks/useRecipe";
import { resizeTextarea } from "~/utils/resizeTextarea";
import ImageGallery from "./ImageGallery";

export default function InstructionItem({ id }: { id: string }) {
  const context = useRecipe();
  const instruction = () => context.recipe.instructions[id];
  const index = () => context.recipe.instructionsOrder.indexOf(id);
  const { addInstructionImage } = context
  let textAreaRef: HTMLTextAreaElement | undefined

  onMount(() => {
    if (textAreaRef) {
      textAreaRef.value = instruction().text
      resizeTextarea(textAreaRef)
    }
  })

  return (
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between md:border-b-3 border-b-2 border-orange">
        <span class="font-bold text-xl md:text-3xl">{index() + 1}.</span>
        <button
          class="text-red-500 text-lg md:text-xl cursor-pointer"
          onClick={() => context.removeInstruction(id)}
        >
          ✕
        </button>
      </div>
      <textarea
        ref={textAreaRef}
        class="outline-none resize-none w-full text-md md:text-lg"
        placeholder="Opisite korak..."
        onInput={(e) => {
          resizeTextarea(textAreaRef)
          context.editInstruction({
            ...instruction(),
            text: e.currentTarget.value
          })
        }}
        spellcheck="false"
      />
      <ImageGallery sectionName={id} images={instruction().images} addImage={(image) => addInstructionImage(image, id)} />
    </div>
  )
}
