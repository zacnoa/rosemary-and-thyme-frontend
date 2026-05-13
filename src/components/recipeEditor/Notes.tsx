import { useRecipe } from "~/hooks/useRecipe";
import { resizeTextarea } from "~/utils/resizeTextarea";

export default function Notes() {
  const context = useRecipe();
  let notesRef: HTMLTextAreaElement | undefined

  return (
    <section class="flex flex-col gap-4">
      <div class="flex border-b-3 md:border-b-4 border-orange">
        <h2 class="text-lg md:text-4xl font-bold pb-1">
          Additional Notes
        </h2>
      </div>
      <textarea
        ref={notesRef}
        class="outline-none resize-none w-full bg-transparent text-md md:text-lg"
        placeholder="Dodajte bilješku..."
        onInput={(e) => {
          resizeTextarea(notesRef);
          context.editSideNotes(e.currentTarget.value)
        }
        } spellcheck="false"
      >
        {context.recipe.sideNotes}
      </textarea>
    </section>
  )
}
