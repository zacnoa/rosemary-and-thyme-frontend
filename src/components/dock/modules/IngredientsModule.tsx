import { Notebook } from "lucide-solid";
import { For, Show, onMount } from "solid-js";
import { useDock } from "../DockContext";
import { UUID } from "~/model/types/UUID";
import { Ingredient } from "~/model/types/recipeTypes";

const PANEL_ID = "ingredients";

type IngredientsModuleProps = {
  ingredients: Record<UUID, Ingredient>,
  ingredientsOrder: UUID[];
}

export default function IngredientsModule(props: IngredientsModuleProps) {
  const { toggle, activePanel, registerPanel } = useDock();

  onMount(() => {
    registerPanel(PANEL_ID, () => (
      <ul class="flex flex-col gap-y-2">
        <For each={props.ingredientsOrder}>
          {(id: UUID) => (
            <Show when={props.ingredients[id].name}>
              <li class="text-background border-b-2 border-background">
                {props.ingredients[id].name}{" "}
                {props.ingredients[id].amount}{" "}
                {props.ingredients[id].measuringUnit}
              </li>
            </Show>
          )}
        </For>
      </ul>
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
