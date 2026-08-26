import Dock from "../dock/Dock";
import CreateRecipeButton from "../dock/modules/CreateRecipeModule";
import HomeButton from "../dock/modules/HomeModule";
import MoreModule from "../dock/modules/MoreModule";
import SearchModule from "../dock/modules/SearchModule";
import UserButton from "../dock/modules/UserModule";

/** Dock module set for the home page (`routes/index.tsx`) - no ingredients/save, since there's no recipe in context here. */
export default function HomeDock() {
  return (
    <Dock>
      <HomeButton />
      <MoreModule />
      <SearchModule />
      <UserButton />
      <CreateRecipeButton />
    </Dock>
  );
}
