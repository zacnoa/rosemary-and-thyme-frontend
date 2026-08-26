
import Dock from "../dock/Dock";
import CreateRecipeButton from "../dock/modules/CreateRecipeModule";
import HomeButton from "../dock/modules/HomeModule";
import IngredientsModule from "../dock/modules/IngredientsModule";
import MoreModule from "../dock/modules/MoreModule";
import SearchModule from "../dock/modules/SearchModule";
import UserButton from "../dock/modules/UserModule";
import { useBlog } from "./context/useBlog";

/**
 * Dock module set for the read-only recipe view - IngredientsModule fed from
 * BlogContext's read-only store, no SaveButton. No wake-lock icon here either -
 * that control now lives inline in Blog.tsx's "What You Need" heading instead of
 * being a separate dock button (see components/common/useWakeLock.ts).
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
