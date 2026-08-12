import { useRecipe } from "./context/useRecipe";
import CreateRecipeButton from "../dock/modules/CreateRecipeModule";
import HomeButton from "../dock/modules/HomeModule";
import IngredientsModule from "../dock/modules/IngredientsModule";
import SaveButton from "../dock/modules/SaveModule";
import KeepScreenOnButton from "../dock/modules/ScreenOnModule";
import SearchModule from "../dock/modules/SearchModule";
import ThemeToggle from "../dock/modules/ThemeModule";
import UserButton from "../dock/modules/UserModule";
import Dock from "../dock/Dock";



/** Dock module set for the recipe editor - the only one that includes IngredientsModule wired to the *editable* store and SaveButton. */
export default function EditorDock() {
  const { recipe } = useRecipe();
  return (
    <Dock>
      <HomeButton />
      <ThemeToggle />
      <KeepScreenOnButton />
      <SearchModule />
      <IngredientsModule ingredients={recipe.ingredients} ingredientsOrder={recipe.ingredientsOrder} />
      <SaveButton />
      <UserButton />
      <CreateRecipeButton />
    </Dock>
  );
}
