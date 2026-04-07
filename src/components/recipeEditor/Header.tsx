import { ThumbsUp } from "lucide-solid";
import { onMount } from "solid-js";
import { useRecipe } from "~/hooks/useRecipe";

export default function Header() {
  const context = useRecipe();
  let titleRef: HTMLTextAreaElement | undefined;
  let descRef: HTMLTextAreaElement | undefined;

  const resizeTextarea = (el: HTMLTextAreaElement | undefined) => {
    if (!el) return;
    el.style.height = "auto"; // resetiraj visinu da scrollHeight bude točan
    el.style.height = el.scrollHeight + "px";
  };

  onMount(() => {
    resizeTextarea(titleRef);
    resizeTextarea(descRef);
  })

  return (
    <div>
      <div class="flex border-b-3 md:border-b-4 border-foreground2">
        <textarea
          ref={titleRef}
          class="flex-1 text-2xl md:text-5xl outline-none resize-none min-w-0  leading-tight"
          rows={1}
          placeholder="Naziv recepta"
          value={context.recipe.name}
          onInput={(e) => {
            resizeTextarea(titleRef);
            context.editName(e.currentTarget.value);
          }}
          spellcheck="false"
        />
        <div class="flex items-center gap-2 text-green border-l-3 md:border-l-4 border-orange pl-2 md:pl-4 w-20 md:w-32">
          <span class="flex items-center">
            <ThumbsUp stroke="var(--color-green)" class="md:size-8 size-5" />
          </span>
          <span class="text-sm mt-1.75 md:mt-2 md:text-2xl leading-none">{context.recipe.rating}</span>
        </div>
      </div>

      <div class="flex">
        <div class="flex-1 min-w-0">
          <div class="text-md md:text-4xl">By {context.recipe.authorName}</div>
          <textarea
            ref={descRef}
            class=" outline-none w-full resize-none text-sm md:text-xl pt-3 pr-2 md:pr-3 leading-tight"
            value={context.recipe.description}
            placeholder="Opis..."
            onInput={(e) => {
              resizeTextarea(descRef);
              context.editDescription(e.currentTarget.value);
            }}
            spellcheck="false"
          />
        </div>
        <div class=" border-l-3 md:border-l-4 border-orange  pt-2 w-20 md:w-32 text-xs md:text-2xl">
          <ul class="text-center">
            <li>{context.recipe.createDate.getDate()}.</li>
            <li>{context.recipe.createDate.getMonth()}.</li>
            <li>{context.recipe.createDate.getFullYear().toString().slice(0, 2)}</li>
            <li>{context.recipe.createDate.getFullYear().toString().slice(2)}.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
