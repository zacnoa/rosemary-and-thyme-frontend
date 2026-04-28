import RecipeEditorContent from "~/components/recipeEditor/RecipeEditorContent";
import RecipeProvider from "~/context/recipeState/RecipeProvider";

export default function RecipeEditor() {

  return (
    <RecipeProvider>
      <RecipeEditorContent />
    </RecipeProvider>
  )
}
