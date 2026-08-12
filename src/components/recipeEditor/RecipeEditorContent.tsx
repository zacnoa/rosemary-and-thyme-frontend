// RecipeEditorContent.tsx
import { clientOnly } from "@solidjs/start";
import BasicInformation from "./BasicInformation";
import Header from "./Header";
import ImageGallery from "./ImageGallery";
import Instructions from "./Instructions";
import Notes from "./Notes";
import { useRecipe } from "./context/useRecipe";

/**
 * The editor page's layout, wrapped by RecipeProvider in routes/recipe/[id].tsx
 * (only rendered when the viewer is the recipe's owner - otherwise Blog.tsx
 * is shown instead, wrapped by BlogProvider).
 *
 * EditorDock is loaded via `clientOnly` (not rendered during SSR at all) since
 * Dock's open/close state and animation only make sense in a real browser.
 */
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
        <section class="fixed bottom-10 left-1/2 -translate-x-1/2 w-[92vw] max-w-md md:w-auto md:max-w-none">
          <EditorDock />
        </section>
      </main>
    </div>
  )
}
