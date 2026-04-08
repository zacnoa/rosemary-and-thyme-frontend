import BasicInformation from "~/components/recipeEditor/BasicInformation";
import Header from "~/components/recipeEditor/Header";
import RecipeProvider from "~/context/recipeState/RecipeProvider";

export default function RecipeEditor() {

  return (
    <RecipeProvider>
      <div class="absolute inset-0 bg-[#2a2a2a] bg-x-pattern-sm md:bg-x-pattern ">
        <main class="md:max-w-4xl my-4  mx-2 md:mx-auto">
          <section>
            <Header></Header>
          </section>
          <section class="mt-20" >
            <BasicInformation />
          </section>
        </main>
      </div>
    </RecipeProvider>
  )
}
