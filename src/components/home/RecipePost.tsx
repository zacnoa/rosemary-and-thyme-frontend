import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { ThumbsUp } from "lucide-solid";
import type { RecipeFeed } from "~/model/interfaces/RecipeFeed";

/**
 * Compact single-line "DD.MM.YYYY." - unlike Blog.tsx's decorative stacked-digit date
 * box (its Header's aside), which needs more vertical space than a feed card's
 * author/date row has to spare.
 */
function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getFullYear()}.`;
}

/**
 * One card in the home page's global recipe feed (see RecipeSearch.tsx, the only
 * caller): name + like count, a divider, an optional preview image alongside the
 * description, another divider, then author + date. Styled in the dock's own dark
 * palette (bg-foreground/text-background/border-background - see
 * components/dock/Dock.tsx) rather than the lighter page palette Blog/RecipeEditor
 * use, per the feature request, so the feed reads as its own distinct browsing
 * surface sitting on the page.
 *
 * `bg-foreground2` (not `bg-foreground`) specifically so the card reads as a distinct
 * surface from the dock bar sitting on top of it (Dock.tsx's bar is `bg-foreground`) -
 * they used to be the exact same shade.
 *
 * Image-and-description is `flex-col` by default (image stacked above description)
 * and only becomes a side-by-side row at `md:` - the reverse of most of this app's
 * "row on desktop, stack on mobile" sections, but that's exactly what was asked for
 * here. `heroImageUrl` being `null` (recipe has no hero image) just skips that half
 * entirely rather than leaving an empty gap - the description alone fills the row.
 *
 * The whole card is a single link to the recipe's page - there's no other
 * interactive element on a feed card (liking only happens from the recipe page
 * itself, and only for a viewer who isn't its owner - see BlogProvider.toggleLike).
 */
export default function RecipePost(props: { recipe: RecipeFeed }) {
  return (
    <A
      href={`/recipe/${props.recipe.id}`}
      class="flex flex-col gap-2 bg-foreground2 text-background rounded-md p-3"
    >
      <div class="flex flex-col">
        <h3 class="text-fluid-base-xl font-bold truncate">{props.recipe.name}</h3>
        <div class="flex items-center gap-1 text-fluid-xs-sm opacity-80">
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
        <p class="text-fluid-sm-base line-clamp-3 flex-1">{props.recipe.description}</p>
      </div>

      <hr class="border-orange border-t-2 md:border-t-3" />

      <div class="flex items-center justify-between text-fluid-xs-sm opacity-80">
        <span>{props.recipe.userName}</span>
        <span>{formatDate(props.recipe.createDate)}</span>
      </div>
    </A>
  );
}
