import { resizeTextarea } from "~/utils/resizeTextarea";
import { useRecipe } from "./context/useRecipe";

/** Free-text notes field, the last section of the editor. */
export default function Notes() {
  const context = useRecipe();
  let notesRef: HTMLTextAreaElement | undefined

  return (
    <section class="flex flex-col gap-4">
      <div class="flex border-b-3 md:border-b-4 border-orange">
        <h2 class="text-fluid-lg-4xl font-bold pb-1">
          Additional Notes
        </h2>
      </div>
      <textarea
        ref={notesRef}
        class="outline-none resize-none w-full bg-transparent text-fluid-base-lg"
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
