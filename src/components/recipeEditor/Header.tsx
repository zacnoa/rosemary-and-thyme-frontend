import { onMount } from "solid-js";
import { ThumbsUp } from "lucide-solid";
import { useRecipe } from "./context/useRecipe";
import { resizeTextarea } from "~/utils/resizeTextarea";

/**
 * Recipe name/description as auto-growing `<textarea>`s (see
 * utils/resizeTextarea.ts) instead of plain inputs, so long text wraps
 * in-place rather than scrolling horizontally.
 *
 * [resizeTextarea] is called both from `onInput` (as the user types) and
 * once from `onMount` below - without the `onMount` call, a textarea whose
 * *initial* value is already long (opening an existing recipe with a long
 * name/description) would stay locked at its collapsed `rows={1}` height
 * until the user's first edit, clipping text that's already there.
 */
export default function Header() {
  const context = useRecipe();
  let titleRef: HTMLTextAreaElement | undefined;
  let descRef: HTMLTextAreaElement | undefined;

  onMount(() => {
    resizeTextarea(titleRef);
    resizeTextarea(descRef);
  });

  return (
    <div>
      <div class="flex border-b-3 md:border-b-4 border-foreground2">
        <textarea
          ref={titleRef}
          class="flex-1 text-fluid-2xl-5xl outline-none resize-none min-w-0  leading-tight"
          rows={1}
          placeholder="Recipe name"
          onInput={(e) => {
            resizeTextarea(titleRef);
            context.editName(e.currentTarget.value);
          }}
          spellcheck="false"
        >{context.recipe.name}</textarea>
        <div class="flex items-center gap-2 text-green border-l-3 md:border-l-4 border-orange pl-2 md:pl-4 w-20 md:w-32">
          <span class="flex items-center">
            <ThumbsUp stroke="var(--color-green)" class="md:size-8 size-5" />
          </span>
          <span class="text-fluid-sm-2xl mt-1.75 md:mt-2 leading-none">{context.recipe.likes}</span>
        </div>
      </div>

      <div class="flex">
        <div class="flex-1 min-w-0">
          <div class="text-fluid-base-4xl">By {context.recipe.userName}</div>
          <textarea
            ref={descRef}
            class=" outline-none w-full resize-none text-fluid-sm-xl pt-3 pr-2 md:pr-3 leading-tight"
            placeholder="Description..."
            onInput={(e) => {
              resizeTextarea(descRef);
              context.editDescription(e.currentTarget.value);
            }}
            spellcheck="false"
          >{context.recipe.description}</textarea>
        </div>
        <div class=" border-l-3 md:border-l-4 border-orange  pt-2 w-20 md:w-32 text-fluid-xs-2xl">
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
