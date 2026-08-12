import { For, Index } from "solid-js";
import { ThumbsUp } from "lucide-solid";
import { clientOnly } from "@solidjs/start";
import { useBlog } from "./context/useBlog";

/*
 * Read-only mirror of the recipeEditor/* components, section for section
 * (Header, BasicInformation/Ingredient, Instructions/InstructionItem,
 * ImageGallery, Notes) - same layout and Tailwind classes, but plain
 * text/`<p>`/`<span>` in place of `<input>`/`<textarea>`, and no edit
 * handlers. Kept as separate local components here (rather than sharing the
 * recipeEditor ones with a "readonly" prop) so this file has zero
 * dependency on RecipeContext/RecipeProvider.
 *
 * ImageGallery here still opens the shared ImageViewer on click, same as
 * recipeEditor/ImageGallery.tsx - see BlogProvider, which mounts it with no
 * `onDelete` since this context has no mutators at all.
 */




function Header() {

  const { recipe } = useBlog();
  return (
    <section>
      <div class="flex border-b-3 md:border-b-4 border-foreground2">
        <h1 class="flex-1 text-fluid-2xl-5xl outline-none resize-none min-w-0  leading-tight"
        >{recipe.name}</h1>
        <div class="flex items-center gap-2 text-green border-l-3 md:border-l-4 border-orange pl-2 md:pl-4 w-20 md:w-32">
          <span class="flex items-center">
            <ThumbsUp stroke="var(--color-green)" class="md:size-8 size-5" />
          </span>
          <span class="text-fluid-sm-2xl mt-1.75 md:mt-2 leading-none">{recipe.likes}</span>
        </div>
      </div>

      <div class="flex">
        <div class="flex-1 min-w-0">
          <h2 class="text-fluid-base-4xl">By {recipe.userName}</h2>
          <article class=" outline-none w-full resize-none text-fluid-sm-xl pt-3 pr-2 md:pr-3 leading-tight"
          >{recipe.description}</article>
        </div>
        <div class=" border-l-3 md:border-l-4 border-orange  pt-2 w-20 md:w-32 text-fluid-xs-2xl">
          <ul class="text-center">
            <li>{recipe.createDate.getDate()}.</li>
            <li>{recipe.createDate.getMonth()}.</li>
            <li>{recipe.createDate.getFullYear().toString().slice(0, 2)}</li>
            <li>{recipe.createDate.getFullYear().toString().slice(2)}.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}


function Ingredient({ id }: { id: string }) {
  const { recipe } = useBlog();
  const ingredient = () => recipe.ingredients[id];

  return (
    <div class="flex items-center gap-2">
      <p class="bg-transparent outline-none w-full">
        {[ingredient().name, ingredient().amount || "", ingredient().measuringUnit]
          .filter(Boolean)
          .join(" ")}
      </p>
    </div>
  )
}

// ─── BasicInformation ───────────────────────────────────────────────────────────

function BasicInformation() {

  const { recipe } = useBlog();
  return (
    <section>
      <div class="flex border-b-3 md:border-b-4 border-foreground2">
        <h2 class="text-fluid-lg-4xl font-bold pb-1 w-1/2 border-r-3 md:border-r-4 border-orange">
          What You Need
        </h2>
        <span class="flex-1" />
      </div>
      <div class="flex">
        <ul class="w-1/2 flex flex-col gap-4 list-none border-r-3 md:border-r-4 border-orange pt-3 pr-3">
          <For each={recipe.ingredientsOrder}>
            {(id) => (
              <li class="text-fluid-sm-xl">
                <Ingredient id={id} />
              </li>
            )}
          </For>
        </ul>
        <aside class="w-1/2 pt-3 pl-3 flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <span class="text-fluid-sm-xl">Preparation</span>
            <span class="text-orange">→</span>
            <p class="outline-none text-fluid-base-xl flex-1">
              {recipe.cookTime}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-fluid-sm-xl">Portions</span>
            <span class="text-orange">→</span>
            <p class="outline-none text-fluid-sm-xl w-12">
              {recipe.portions}
            </p>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-fluid-sm-xl">Difficulty</span>
            <div class="flex gap-1">
              <Index each={[1, 2, 3, 4, 5]}>
                {(star) => (
                  <span
                    class="cursor-pointer text-fluid-xl-2xl"
                    style={{
                      color: star() <= recipe.difficulty
                        ? "var(--color-blue)"
                        : "var(--color-foreground)"
                    }}
                  >
                    ★
                  </span>
                )}
              </Index>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}




function ImageGallery(props: { images: string[] }) {



  const { recipe, openViewer } = useBlog()


  return (
    <div class="flex flex-col gap-y-4"  >
      <div class="w-full overflow-x-auto cursor-pointer" onClick={() => openViewer(props.images)}>
        <div class="flex flex-row gap-4" style="width: max-content">
          <For each={props.images}>
            {(image, index) => (
              <div class="shrink-0">
                <img onClick={() => openViewer(props.images, index())} class="h-32 md:h-72 w-auto" src={recipe.images[image].url ?? recipe.images[image].blobURL!} />
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  )
}


function InstructionItem({ id }: { id: string }) {


  const { recipe } = useBlog();
  const instruction = () => recipe.instructions[id];
  const index = () => recipe.instructionsOrder.indexOf(id);

  return (
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between md:border-b-3 border-b-2 border-orange">
        <span class="font-bold text-fluid-xl-3xl">{index() + 1}.</span>
      </div>
      <p class="outline-none resize-none w-full text-fluid-base-lg">
        {instruction().text}
      </p>
      <ImageGallery images={instruction().images} />
    </div >
  )
}

function Instructions() {

  const { recipe } = useBlog();

  return (
    <div class="flex flex-col gap-4">
      <For each={recipe.instructionsOrder}>
        {(id) => (
          <div class="flex flex-col gap-4">
            <InstructionItem id={id} />
          </div>
        )}
      </For>
    </div>
  )
}


function Notes() {


  const { recipe } = useBlog();

  return (
    <section class="flex flex-col gap-4">
      <div class="flex border-b-3 md:border-b-4 border-orange">
        <h2 class="text-fluid-lg-4xl font-bold pb-1">
          Additional Notes
        </h2>
      </div>
      <p class="outline-none resize-none w-full bg-transparent text-fluid-base-lg" >
        {recipe.sideNotes}
      </p >
    </section>
  )

}


/** Full read-only recipe page, shown to any viewer who isn't the recipe's owner (see routes/recipe/[id].tsx). */
export default function Blog() {

  const BlogDock = clientOnly(() => import("./BlogDock"))
  const { recipe } = useBlog()
  return (
    <div class="w-full overflow-hidden">
      <main class="md:max-w-4xl my-4 mx-2 md:mx-auto">
        <section><Header /></section>
        <section class="mt-20">
          <ImageGallery images={recipe.heroImagesOrder} />
        </section>
        <section class="mt-20"><BasicInformation /></section>
        <section class="mt-20"><Instructions /></section>
        <section class="mt-20 mb-40"><Notes /></section>
        <section class="fixed bottom-10 left-1/2 -translate-x-1/2 w-[92vw] max-w-md md:w-auto md:max-w-none">
          <BlogDock />
        </section>
      </main>
    </div>
  )
}
