
import Dock from "../dock/Dock";
import HomeButton from "../dock/modules/HomeModule";
import IngredientsModule from "../dock/modules/IngredientsModule";
import EyeOffButton from "../dock/modules/ScreenOnModule";
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
      <IngredientsModule
        ingredients={recipe.ingredients}
        ingredientsOrder={recipe.ingredientsOrder}
      />
      <UserButton />
    </Dock>
  );
}
