
import Dock from "../dock/Dock";
import CreateRecipeButton from "../dock/modules/CreateRecipeModule";
import HomeButton from "../dock/modules/HomeModule";
import IngredientsModule from "../dock/modules/IngredientsModule";
import KeepScreenOnButton from "../dock/modules/ScreenOnModule";
import SearchModule from "../dock/modules/SearchModule";
import ThemeToggle from "../dock/modules/ThemeModule";
import UserButton from "../dock/modules/UserModule";
import { useBlog } from "./context/useBlog";

/** Dock module set for the read-only recipe view - IngredientsModule fed from BlogContext's read-only store, no SaveButton. */
export default function BlogDock() {
  const { recipe } = useBlog();
  return (
    <Dock>
      <HomeButton />
      <ThemeToggle />
      <KeepScreenOnButton />
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
