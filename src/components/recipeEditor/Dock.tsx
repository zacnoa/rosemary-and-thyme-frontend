import { EyeOff, House, Moon, Notebook, Save, Search, Sun, User } from "lucide-solid";
import { createSignal, For, Show } from "solid-js";
import { useRecipe } from "~/hooks/useRecipe";
import { UUID } from "~/model/types/UUID";

export default function Dock() {
  const context = useRecipe()
  const [activePanel, setActivePanel] = createSignal<"ingredients" | "search" | null>(null);
  const [theme, setTheme] = createSignal<"dark" | "light">("dark");

  const toggle = (panel: "ingredients" | "search") => {
    setActivePanel(activePanel() === panel ? null : panel);
  }

  const toggleTheme = () => {
    const next = theme() === "dark" ? "light" : "dark";
    setTheme(next)
    document.documentElement.setAttribute("data-theme", next)
  }

  return (
    <div class="relative w-full">

      {/* Ingredients panel */}
      <div class="pointer-events-none absolute bottom-full w-full overflow-hidden h-40 translate-y-2">
        <div class={`w-full h-full transition-transform duration-300 ${activePanel() === "ingredients" ? "translate-y-0" : "translate-y-full"}`}>
          <div class="bg-foreground3 rounded-t-2xl p-3 pb-4 w-full h-full overflow-y-auto">
            <ul class="flex flex-col gap-y-2">
              <For each={context.recipe.ingredientsOrder}>
                {(id: UUID) => (
                  <Show when={context.recipe.ingredients[id].name}>
                    <li class="text-background border-b-2 border-background">
                      {context.recipe.ingredients[id].name} {context.recipe.ingredients[id].amount} {context.recipe.ingredients[id].measuringUnit}
                    </li>
                  </Show>
                )}
              </For>
            </ul>
          </div>
        </div >
      </div >

      {/* Search panel */}
      < div class="pointer-events-none absolute bottom-full w-full overflow-hidden h-40 translate-y-2" >
        <div class={`w-full h-full transition-transform duration-300 ${activePanel() === "search" ? "translate-y-2" : "translate-y-full"}`}>
          <div class="bg-foreground3 rounded-t-2xl p-3 pb-4 w-full h-full">
            <input
              type="text"
              class="w-full p-2 text-background border-2 rounded-2xl border-background"
              placeholder="Search your recipes"
            />
          </div>
        </div>
      </div >

      {/* Dock bar */}
      < div class="relative translate-y-1 w-full bg-foreground md:p-2 p-1 rounded-md z-10" >
        <ul class="flex md:gap-x-12 gap-x-3">
          <li class="bg-blue p-1 rounded-md cursor-pointer">
            <House color="var(--color-background)" class="md:w-[30px] h-auto" />
          </li>
          <li class="bg-foreground p-1 rounded-md cursor-pointer" onClick={() => toggleTheme()}>
            <Show when={theme() == "dark"} fallback={
              <Sun color="var(--color-background)" class="md:w-[30px] h-auto" />
            }>
              <Moon color="var(--color-background)" class="md:w-[30px] h-auto" />
            </Show>
          </li>
          <li class="bg-red rounded-md p-1 cursor-pointer">
            <EyeOff color="var(--color-background)" class="md:w-[30px] h-auto" />
          </li>
          <li class={`rounded-md p-1 cursor-pointer ${activePanel() === "search" ? "bg-orange" : "bg-foreground"}`}
            onClick={() => toggle("search")}
          >
            <Search color="var(--color-background)" class="md:w-[30px] h-auto" />
          </li>
          <li
            class={`rounded-md p-1 cursor-pointer ${activePanel() === "ingredients" ? "bg-purple" : "bg-foreground"}`}
            onClick={() => toggle("ingredients")}
          >
            <Notebook color="var(--color-background)" class="md:w-[30px] h-auto" />
          </li>
          <li onClick={() => context.saveRecipe(context.recipe)} class={`${context.changedFlag() ? "bg-green" : "bg-foreground"} rounded-md p-1 cursor-pointer`}>
            <Save color="var(--color-background)" class="md:w-[30px] h-auto" />
          </li>
          <li class="bg-gray rounded-md p-1 cursor-pointer">
            <User color="var(--color-background)" class="md:w-[30px] h-auto" />
          </li>
        </ul>
      </div >
    </div >
  )
}
