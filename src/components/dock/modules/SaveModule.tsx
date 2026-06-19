import { Save } from "lucide-solid";
import { useRecipe } from "~/hooks/useRecipe";

export default function SaveButton() {
  const context = useRecipe();

  return (
    <li
      class={`${context.changedFlag() ? "bg-green" : "bg-foreground"
        } rounded-md p-1 cursor-pointer`}
      onClick={() => context.saveRecipe(context.recipe)}
    >
      <Save color="var(--color-background)" class="md:w-[30px] h-auto" />
    </li>
  );
}
