
import Dock from "../dock/Dock";
import CreateRecipeButton from "../dock/modules/CreateRecipeModule";
import HomeButton from "../dock/modules/HomeModule";
import IngredientsModule from "../dock/modules/IngredientsModule";
import MoreModule from "../dock/modules/MoreModule";
import SearchModule from "../dock/modules/SearchModule";
import UserButton from "../dock/modules/UserModule";
import { useBlog } from "./context/useBlog";

/**
 * Provides the BlogDock function.
 */
export default function BlogDock() {
  const { recipe } = useBlog();
  return (
    <Dock>
      <HomeButton />
      <MoreModule />
      <SearchModule />
      <IngredientsModule
        ingredients={recipe.ingredients}
        ingredientsOrder={recipe.ingredientsOrder}
      />
      <UserButton />
      <CreateRecipeButton />
    </Dock>
  );
}
