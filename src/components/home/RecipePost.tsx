import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { ThumbsUp } from "lucide-solid";
import type { RecipeFeed } from "~/model/interfaces/RecipeFeed";

/**
 * Provides the formatDate function.
 */
function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getFullYear()}.`;
}

/**
 * Provides the RecipePost function.
 */
export default function RecipePost(props: { recipe: RecipeFeed }) {
  return (
    <A
      href={`/recipe/${props.recipe.id}`}
      class="flex flex-col gap-2 bg-foreground2 text-background rounded-md p-3"
    >
      <div class="flex flex-col">
        <h3 class="text-base md:text-xl font-bold truncate">{props.recipe.name}</h3>
        <div class="flex items-center gap-1 text-xs md:text-sm opacity-80">
          <ThumbsUp class="size-4" fill={props.recipe.likes > 0 ? "var(--color-background)" : "none"} />
          <span>{props.recipe.likes}</span>
        </div>
      </div>

      <hr class="border-orange border-t-2 md:border-t-3" />

      <div class="flex flex-col md:flex-row gap-3">
        <Show when={props.recipe.heroImageUrl}>
          {(url) => (
            <img
              src={url()}
              alt={props.recipe.name}
              class="w-full md:w-32 h-32 object-cover rounded-md shrink-0"
            />
          )}
        </Show>
        <p class="text-sm md:text-base line-clamp-3 flex-1">{props.recipe.description}</p>
      </div>

      <hr class="border-orange border-t-2 md:border-t-3" />

      <div class="flex items-center justify-between text-xs md:text-sm opacity-80">
        <span>{props.recipe.userName}</span>
        <span>{formatDate(props.recipe.createDate)}</span>
      </div>
    </A>
  );
}
