import { Recipe } from "~/model/interfaces/Recipe";
import { BlogContext } from "./blogContext";
import { createStore } from "solid-js/store";
import { createSignal, ParentProps } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";
import { useAuth } from "~/components/auth/context/useAuth";
import { setRecipeLiked } from "~/queries/likeRecipe";
import { loginHref } from "~/utils/loginRedirect";
import { markRecipeMade } from "~/queries/markRecipeMade";
import { useNotification } from "~/components/notification/context/useNotification";

interface BlogProviderProps extends ParentProps {
  recipe: Recipe
}

/** Provides the BlogProvider function. */
export default function BlogProvider(props: BlogProviderProps) {

  const [recipe, setRecipe] = createStore<Recipe>(props.recipe)
  const [liked, setLiked] = createSignal(props.recipe.liked);
  const [likes, setLikes] = createSignal(props.recipe.likes);
  const [likePending, setLikePending] = createSignal(false);
  const [timesMade, setTimesMade] = createSignal(props.recipe.timesMade);
  const [madePending, setMadePending] = createSignal(false);
  const { notify } = useNotification();

  const user = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /** Provides the toggleLike function. */
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

  /** Records one completed preparation without requiring an account. */
  const markMade = async () => {
    if (madePending()) return;

    setMadePending(true);
    try {
      const { ok, status, json } = await markRecipeMade(recipe.id);
      if (ok) {
        setTimesMade(json.timesMade);
        notify("success", "Recipe marked as made");
      } else if (status === 429) {
        notify("error", json.detail ?? "This recipe was already marked as made from your network in the last 6 hours.");
      } else {
        notify("error", json.detail ?? "Could not mark this recipe as made");
      }
    } catch {
      notify("error", "Could not reach the server - check your connection and try again");
    } finally {
      setMadePending(false);
    }
  };

  return (
    <BlogContext.Provider value={{
      recipe,
      liked,
      likes,
      timesMade,
      madePending,
      toggleLike,
      markMade,
    }}>
      {props.children}
    </BlogContext.Provider>
  )
}
