import { useRecipe } from "./context/useRecipe";

export default function Ingredient({ id }: { id: string }) {
  const context = useRecipe();
  const ingredient = () => context.recipe.ingredients[id];

  return (
    <div class="flex items-center gap-2">
      <input
        type="text"
        class="bg-transparent outline-none w-full"
        value={[ingredient().name, ingredient().amount || "", ingredient().measuringUnit]
          .filter(Boolean)
          .join(" ")}
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
      <button
        class="cursor-pointer text-foreground"
        onClick={() => context.removeIngredient(id)}
      >
        ✕
      </button>
    </div>
  )
}
