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
 * Dock module set for the recipe editor - the only one that includes IngredientsModule
 * wired to the *editable* store and SaveButton. No wake-lock icon here (unlike the old
 * ScreenOnModule this used to render): editing isn't a hands-off, screen-glancing
 * activity the way following a recipe read-only is, so there's no need to keep the
 * screen from sleeping while typing.
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
