
import Dock from "../dock/Dock";
import CreateRecipeButton from "../dock/modules/CreateRecipeModule";
import HomeButton from "../dock/modules/HomeModule";
import IngredientsModule from "../dock/modules/IngredientsModule";
import EyeOffButton from "../dock/modules/ScreenOnModule";
import SearchModule from "../dock/modules/SearchModule";
import ThemeToggle from "../dock/modules/ThemeModule";
import UserButton from "../dock/modules/UserModule";
import { useBlog } from "./context/useBlog";

export default function BlogDockSection() {
  const { recipe } = useBlog();
  return (
    <Dock>
      <HomeButton />
      <ThemeToggle />
      <EyeOffButton />
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
