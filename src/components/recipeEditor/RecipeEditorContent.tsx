// RecipeEditorContent.tsx
import { useRecipe } from "~/hooks/useRecipe";
import { clientOnly } from "@solidjs/start";
import BasicInformation from "./BasicInformation";
import Header from "./Header";
import ImageGallery from "./ImageGallery";
import Instructions from "./Instructions";
import Notes from "./Notes";

export default function RecipeEditorContent() {
  const { recipe, addBannerImage } = useRecipe()

  const EditorDock = clientOnly(() => import("./EditorDock"))
  return (
    <div class="w-full overflow-hidden">
      <main class="md:max-w-4xl my-4 mx-2 md:mx-auto">
        <section><Header /></section>
        <section class="mt-20">
          <ImageGallery sectionName="banner" images={recipe.heroImagesOrder} addImage={addBannerImage} />
        </section>
        <section class="mt-20"><BasicInformation /></section>
        <section class="mt-20"><Instructions /></section>
        <section class="mt-20 mb-40"><Notes /></section>
        <section class="fixed bottom-10 left-1/2 -translate-x-1/2">
          <EditorDock />
        </section>
      </main>
    </div>
  )
}
