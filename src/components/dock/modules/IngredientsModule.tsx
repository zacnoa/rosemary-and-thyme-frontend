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

/**
 * Read-only ingredients checklist panel, shared by the editor (EditorDock,
 * fed from the live-editable RecipeProvider store) and the blog view
 * (BlogDock, fed from the read-only BlogProvider store) - this component
 * itself doesn't know or care which.
 *
 * `props.ingredients`/`props.ingredientsOrder` are read reactively (plain
 * property access inside JSX/`<Show>`/`<For>`, not copied into local state),
 * so the list reflects the store live: while editing, every keystroke that
 * successfully parses (see recipeEditor/Ingredient.tsx) updates this panel
 * immediately if it's open, and a save's server-reconciled ids/values (see
 * RecipeProvider.applyServerRecipe) flow through the same way.
 */
export default function IngredientsModule(props: IngredientsModuleProps) {
  const { toggle, activePanel, registerPanel } = useDock();

  /** Ingredients only "count" once they have a name - a freshly-added, still-blank ingredient shouldn't flip the panel out of its empty-state fallback. */
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
