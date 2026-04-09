import BasicInformation from "~/components/recipeEditor/BasicInformation";
import Header from "~/components/recipeEditor/Header";
import Instructions from "~/components/recipeEditor/Instructions";
import Notes from "~/components/recipeEditor/Notes";
import RecipeProvider from "~/context/recipeState/RecipeProvider";

export default function RecipeEditor() {

  return (
    <RecipeProvider>
      <div class="w-full bg-background bg-x-pattern-sm md:bg-x-pattern overflow-hidden">
        <main class="md:max-w-4xl my-4  mx-2 md:mx-auto">
          <section>
            <Header></Header>
          </section>
          <section class="mt-20" >
            <BasicInformation />
          </section>
          <section class="mt-20">
            <Instructions />
          </section>
          <section class="mt-20">
            <Notes />
          </section>
        </main>
      </div>
    </RecipeProvider>
  )
}
