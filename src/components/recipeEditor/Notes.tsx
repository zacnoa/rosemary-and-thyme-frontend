import { onMount } from "solid-js";
import { resizeTextarea } from "~/utils/resizeTextarea";
import { useRecipe } from "./context/useRecipe";

/**
 * Free-text notes field, the last section of the editor.
 *
 * [resizeTextarea] runs once on mount (in addition to every `onInput`) so a
 * recipe loaded with existing, already-long notes shows fully expanded
 * right away, instead of staying clipped at its collapsed height until the
 * first edit - see Header.tsx for the same fix and fuller explanation.
 */
export default function Notes() {
  const context = useRecipe();
  let notesRef: HTMLTextAreaElement | undefined

  onMount(() => resizeTextarea(notesRef));

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
