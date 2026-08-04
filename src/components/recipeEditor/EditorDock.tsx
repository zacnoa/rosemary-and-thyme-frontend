import { useRecipe } from "./context/useRecipe";
import CreateRecipeButton from "../dock/modules/CreateRecipeModule";
import HomeButton from "../dock/modules/HomeModule";
import IngredientsModule from "../dock/modules/IngredientsModule";
import SaveButton from "../dock/modules/SaveModule";
import EyeOffButton from "../dock/modules/ScreenOnModule";
import SearchModule from "../dock/modules/SearchModule";
import ThemeToggle from "../dock/modules/ThemeModule";
import UserButton from "../dock/modules/UserModule";
import Dock from "../dock/Dock";



export default function BlogDockSection() {
  const { recipe } = useRecipe();
  return (
    <Dock>
      <HomeButton />
      <ThemeToggle />
      <EyeOffButton />
      <SearchModule />
      <IngredientsModule ingredients={recipe.ingredients} ingredientsOrder={recipe.ingredientsOrder} />
      <SaveButton />
      <UserButton />
      <CreateRecipeButton />
    </Dock>
  );
}
