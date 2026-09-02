import { Save } from "lucide-solid";
import { onMount } from "solid-js";
import { useDock } from "../context/DockContext";
import { useRecipe } from "~/components/recipeEditor/context/useRecipe";
import SlideToConfirm from "~/components/common/SlideToConfirm";

const PANEL_ID = "save";

/**
 * Provides the SaveSlider function.
 */
function SaveSlider() {
  const context = useRecipe();

  /**
 * Provides the disabledReason function.
 */
  const disabledReason = (): string | null => {
    if (!context.changedFlag()) return "Nothing to save yet";
    const blockers = context.saveBlockers();
    return blockers.length > 0 ? blockers[0] : null;
  };

  return (
    <SlideToConfirm
      label="Slide to save →"
      icon={<Save color="var(--color-background)" class="size-5" />}
      thumbColor="bg-green"
      disabledReason={disabledReason}
      onConfirm={() => context.saveRecipe(context.recipe)}
    />
  );
}

/**
 * Provides the SaveButton function.
 */
export default function SaveButton() {
  const context = useRecipe();
  const { toggle, activePanel, registerPanel } = useDock();

  onMount(() => {
    registerPanel(PANEL_ID, () => <SaveSlider />);
  });

  return (
    <li
      class={`rounded-md p-1 cursor-pointer ${activePanel() === PANEL_ID
        ? "bg-purple"
        : context.changedFlag() ? "bg-green" : "bg-foreground"
        }`}
      onClick={() => toggle(PANEL_ID)}
    >
      <Save color="var(--color-background)" class="md:w-[30px] h-auto" />
    </li>
  );
}
