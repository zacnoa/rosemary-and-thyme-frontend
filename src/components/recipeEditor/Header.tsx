import { useRecipe } from "~/hooks/useRecipe";

export default function Header() {
  const context = useRecipe();
  return (
    <div>
      {/* Gornji dio */}
      <div class="flex border-b-2 md:border-b-3  border-foreground3">
        <textarea
          class="flex-1 text-2xl md:text-6xl font-bold bg-transparent outline-none resize-none min-w-0"
          placeholder="Naziv recepta"
          value={context.recipe.name}
          rows={1}
          onInput={(e) => {
            e.target.style.height = 'auto'
            e.target.style.height = e.target.scrollHeight + 'px'
            context.editName(e.target.value)
          }}
        />
        <div class="flex items-center gap-2 text-green border-l-2 md:border-l-3 border-orange pl-2 md:pl-4 w-20 md:w-32">
          <span class="fill-green">
            {/* <RiSystemThumbUpFill /> */}
          </span>
          <span class="text-sm md:text-base">{context.recipe.rating}</span>
        </div>
      </div>
      <div class="flex">
        {/* Donji dio */}
        <div class="flex-1">
          <div class="text-md md:text-4xl text-foreground3">By {context.recipe.authorName}</div>
          <textarea
            class="bg-transparent outline-none text-foreground3 w-full resize-none text-sm md:text-lg pt-3"
            value={context.recipe.description}
            placeholder="Opis..."
            rows={1}
            onInput={(e) => {
              e.target.style.height = 'auto'
              e.target.style.height = e.target.scrollHeight + 'px'
              context.editDescription(e.target.value)
            }}
          />
        </div>
        <div class="border-l-2 md:border-l-3 border-orange pl-2 md:pl-4 w-20 md:w-32 text-xs md:text-sm">
          {context.recipe.createDate.toISOString()}
        </div>
      </div>
    </div>
  )
}
