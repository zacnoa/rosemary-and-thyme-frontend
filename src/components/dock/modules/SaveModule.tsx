import { Save } from "lucide-solid";
import { useRecipe } from "~/components/recipeEditor/context/useRecipe";

/**
 * No panel - a plain button that saves on click. Turns green while
 * `changedFlag()` is set (i.e. there's something to save) and reverts once
 * RecipeProvider.saveRecipe clears it - see that provider for exactly when
 * that happens (not simply "whenever the store changes", since it also
 * needs to ignore the store mutation the post-save server-reconcile itself
 * causes).
 */
export default function SaveButton() {
  const context = useRecipe();

  return (
    <li
      class={`${context.changedFlag() ? "bg-green" : "bg-foreground"
        } rounded-md p-1 cursor-pointer`}
      onClick={() => context.saveRecipe(context.recipe)}
    >
      <Save color="var(--color-background)" class="md:w-[30px] h-auto" />
    </li>
  );
}
