import { Recipe } from "~/model/interfaces/Recipe";
import { BlogContext } from "./blogContext";
import { createStore } from "solid-js/store";
import { ParentProps } from "solid-js";

interface BlogProviderProps extends ParentProps {
  recipe: Recipe
}


export default function BlogProvider(props: BlogProviderProps) {

  const [recipe, setRecipe] = createStore<Recipe>(props.recipe)


  return (
    <BlogContext.Provider value={{
      recipe
    }}>
      {props.children}
    </BlogContext.Provider>


  )
}
