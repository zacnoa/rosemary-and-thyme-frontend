import Dock from "../dock/Dock";
import CreateRecipeButton from "../dock/modules/CreateRecipeModule";
import HomeButton from "../dock/modules/HomeModule";
import SearchModule from "../dock/modules/SearchModule";
import ThemeToggle from "../dock/modules/ThemeModule";
import UserButton from "../dock/modules/UserModule";

export default function HomeDock() {
  return (
    <Dock>
      <HomeButton />
      <ThemeToggle />
      <SearchModule />
      <UserButton />
      <CreateRecipeButton />
    </Dock>
  );
}
