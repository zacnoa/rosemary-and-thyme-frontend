import { Notebook } from "lucide-solid";
import { For, Show, onMount } from "solid-js";
import { useDock } from "../context/DockContext";
import { UUID } from "~/model/types/UUID";
import { Ingredient } from "~/model/types/recipeTypes";

const PANEL_ID = "ingredients";

type IngredientsModuleProps = {
  ingredients: Record<UUID, Ingredient>,
  ingredientsOrder: UUID[];
}

export default function IngredientsModule(props: IngredientsModuleProps) {
  const { toggle, activePanel, registerPanel } = useDock();

  const hasIngredients = () =>
    props.ingredientsOrder.some((id) => props.ingredients[id]?.name);

  onMount(() => {
    registerPanel(PANEL_ID, () => (
      <Show
        when={hasIngredients()}
        fallback={
          <p class="text-sm text-background opacity-80">
            This is your ingredient list - add a few ingredients to see them show up here.
          </p>
        }
      >
        <ul class="flex flex-col gap-y-2">
          <For each={props.ingredientsOrder}>
            {(id: UUID) => (
              <li class="text-background border-b-2 border-background">
                {props.ingredients[id].name}{" "}
                {props.ingredients[id].amount}{" "}
                {props.ingredients[id].measuringUnit}
              </li>
            )}
          </For>
        </ul>
      </Show>
    ));
  });

  return (
    <li
      class={`rounded-md p-1 cursor-pointer ${activePanel() === PANEL_ID ? "bg-purple" : "bg-foreground"
        }`}
      onClick={() => toggle(PANEL_ID)}
    >
      <Notebook color="var(--color-background)" class="md:w-[30px] h-auto" />
    </li>
  );
}
