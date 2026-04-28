// RecipeEditorContent.tsx
import { useRecipe } from "~/hooks/useRecipe";
import BasicInformation from "./BasicInformation";
import Header from "./Header";
import ImageGallery from "./ImageGallery";
import Instructions from "./Instructions";
import Notes from "./Notes";
import Dock from "./Dock";

export default function RecipeEditorContent() {
  const { recipe, addBannerImage } = useRecipe()
  return (
    <div class="w-full overflow-hidden">
      <main class="md:max-w-4xl my-4 mx-2 md:mx-auto">
        <section><Header /></section>
        <section class="mt-20">
          <ImageGallery sectionName="banner" images={recipe.bannerImages} addImage={addBannerImage} />
        </section>
        <section class="mt-20"><BasicInformation /></section>
        <section class="mt-20"><Instructions /></section>
        <section class="mt-20 mb-40"><Notes /></section>
        <section class="fixed bottom-10 left-1/2 -translate-x-1/2">
          <Dock />
        </section>
      </main>
    </div>
  )
}
