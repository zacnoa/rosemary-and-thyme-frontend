import { useRecipe } from "./context/useRecipe";
import CreateRecipeButton from "../dock/modules/CreateRecipeModule";
import HomeButton from "../dock/modules/HomeModule";
import IngredientsModule from "../dock/modules/IngredientsModule";
import SaveButton from "../dock/modules/SaveModule";
import MoreModule from "../dock/modules/MoreModule";
import SearchModule from "../dock/modules/SearchModule";
import UserButton from "../dock/modules/UserModule";
import Dock from "../dock/Dock";



/**
 * Provides the EditorDock function.
 */
export default function EditorDock() {
  const { recipe } = useRecipe();
  return (
    <Dock>
      <HomeButton />
      <MoreModule />
      <SearchModule />
      <IngredientsModule ingredients={recipe.ingredients} ingredientsOrder={recipe.ingredientsOrder} />
      <SaveButton />
      <UserButton />
      <CreateRecipeButton />
    </Dock>
  );
}
