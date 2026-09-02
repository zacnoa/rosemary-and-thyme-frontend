import { Recipe } from "~/model/interfaces/Recipe";
import { BlogContext } from "./blogContext";
import { createStore } from "solid-js/store";
import { createSignal, ParentProps } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";
import { useAuth } from "~/components/auth/context/useAuth";
import { setRecipeLiked } from "~/queries/likeRecipe";
import { loginHref } from "~/utils/loginRedirect";

interface BlogProviderProps extends ParentProps {
  recipe: Recipe
}

/**
 * Provides the BlogProvider function.
 */
export default function BlogProvider(props: BlogProviderProps) {

  const [recipe, setRecipe] = createStore<Recipe>(props.recipe)
  const [liked, setLiked] = createSignal(props.recipe.liked);
  const [likes, setLikes] = createSignal(props.recipe.likes);
  const [likePending, setLikePending] = createSignal(false);

  const user = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /**
 * Provides the toggleLike function.
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
    }}>
      {props.children}
    </BlogContext.Provider>
  )
}
