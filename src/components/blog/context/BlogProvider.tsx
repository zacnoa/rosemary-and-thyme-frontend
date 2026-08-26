import { Recipe } from "~/model/interfaces/Recipe";
import { BlogContext } from "./blogContext";
import { createStore } from "solid-js/store";
import { createSignal, ParentProps, Show } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";
import { UUID } from "~/model/types/UUID";
import ImageViewer from "~/components/recipeEditor/ImageViewer";
import { useAuth } from "~/components/auth/context/useAuth";
import { setRecipeLiked } from "~/queries/likeRecipe";
import { loginHref } from "~/utils/loginRedirect";

interface BlogProviderProps extends ParentProps {
  recipe: Recipe
}

/**
 * Read-only view of a recipe for visitors who aren't its owner (see
 * routes/recipe/[id].tsx, which picks this vs. RecipeProvider based on that).
 * Still wraps `props.recipe` in a store (like RecipeProvider does) purely
 * for consistent, fine-grained reactive reads by shared components like
 * IngredientsModule - nothing here ever calls `setRecipe`, so in practice
 * this store's value never changes after mount.
 *
 * Also mounts the shared ImageViewer, same as RecipeProvider - but with no
 * `onDelete`, since this context exposes no mutators at all (see
 * ImageViewer for how that hides the delete button).
 *
 * `liked`/`likes` are tracked as their own signals rather than read straight off
 * `recipe.liked`/`recipe.likes` - `recipe` here is a `createStore` snapshot seeded
 * once at mount (see the class doc on routes/recipe/[id].tsx for why that's fine for
 * everything else, which never changes after mount), but a like *can* change during
 * this component's lifetime (the visitor clicking the like button), so it needs its
 * own reactive signal `toggleLike` actually writes to.
 */
export default function BlogProvider(props: BlogProviderProps) {

  const [recipe, setRecipe] = createStore<Recipe>(props.recipe)
  const [viewerImages, setViewerImages] = createSignal<{ images: UUID[], initialIndex?: number } | null>(null);
  const [liked, setLiked] = createSignal(props.recipe.liked);
  const [likes, setLikes] = createSignal(props.recipe.likes);
  const [likePending, setLikePending] = createSignal(false);

  const user = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const openViewer = (images: UUID[], initialIndex: number = 0) => setViewerImages({ images: images, initialIndex: initialIndex });
  const closeViewer = () => setViewerImages(null);

  /**
   * A signed-out visitor gets sent straight to the login page instead of the
   * request ever firing - the backend would reject it anyway (see
   * queries/likeRecipe.ts), but there's no reason to round-trip to the server just
   * to find that out when `useAuth()` already knows locally. `likePending` guards
   * against a second click firing a second request before the first one's response
   * comes back (e.g. an impatient double-click) - not a possible double-*like*
   * either way (the backend is idempotent, see RecipeService.likeRecipe/unlikeRecipe),
   * but it would otherwise let `liked`/`likes` end up set from whichever of the two
   * responses happens to land last.
   */
  const toggleLike = async () => {
    if (!user) {
      navigate(loginHref(location.pathname));
      return;
    }
    if (likePending()) return;

    setLikePending(true);
    try {
      const { ok, json } = await setRecipeLiked(recipe.id, !liked());
      if (ok) {
        setLiked(json.liked);
        setLikes(json.likes);
      }
    } finally {
      setLikePending(false);
    }
  };

  return (
    <BlogContext.Provider value={{
      recipe,
      liked,
      likes,
      toggleLike,
      viewerImages,
      openViewer,
      closeViewer,
    }}>
      {props.children}
      <Show when={viewerImages()?.images}>
        <ImageViewer
          images={viewerImages()!.images}
          imageMap={recipe.images}
          initialIndex={viewerImages()?.initialIndex}
          onClose={closeViewer}
        />
      </Show>
    </BlogContext.Provider>


  )
}
