import { useRecipe } from "~/hooks/useRecipe";

export default function IngredientInput({ id }: { id: string }) {
  const context = useRecipe();
  const ingredient = () => context.recipe.ingredients[id];

  return (
    <input
      class="bg-transparent outline-none w-full"
      value={`${ingredient().name} ${ingredient().amount || ""}${ingredient().measuringUnit}`}
      placeholder="npr. Pileca prsa 150g"
      onBlur={(e) => {
        const match = e.currentTarget.value.match(/^(.+?)\s+([\d.]+)\s*(\p{L}+)?$/u)
        if (match) {
          context.editIngredient({
            ...ingredient(),
            name: match[1].trim(),
            amount: Number(match[2]),
            measuringUnit: match[3] ?? "",
          })
        }
      }}
      spellcheck="false"
    />
  )
}
