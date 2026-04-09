import { v4 as uuid } from "uuid";
import { onMount, ParentProps } from "solid-js";
import { createStore, produce, reconcile } from "solid-js/store";
import { Recipe } from "~/model/interfaces/Recipe";
import { RecipeContext } from "./recipeContext";
import { UUID } from "~/model/types/UUID";
import { Ingredient, Instruction } from "~/model/types/recipeTypes";
import { RecipeImage } from "~/model/types/utils";
import { createDefaultRecipe } from "./defaultRecipe";




export default function RecipeProvider(props: ParentProps) {


  const [recipe, setRecipe] = createStore<Recipe>(createDefaultRecipe())

  const initializeRecipe = (state: Recipe) => {
    setRecipe(reconcile(state));
  }

  const editName = (text: string) => {
    setRecipe("name", text)
  }

  const editDescription = (text: string) => {
    setRecipe("description", text)
  }

  const editRating = (rating: number) => {
    setRecipe("rating", rating)
  }

  const editPortion = (portion: number) => {
    setRecipe("portions", portion)
  }

  const editCookTime = (text: string) => {
    setRecipe("cookTime", text)
  }

  const editDifficulty = (difficulty: number) => {
    setRecipe("difficulty", difficulty)
  }

  const editSideNotes = (text: string) => {
    setRecipe("sideNotes", text)
  }

  const addIngredient = () => {
    const id: UUID = uuid()
    setRecipe("ingredients", id, {
      id,
      name: "",
      amount: 0,
      measuringUnit: "",
    })
    setRecipe("ingredientsOrder", recipe.ingredientsOrder.length, id)
  }

  const editIngredient = (ingredient: Ingredient) => {
    setRecipe("ingredients", ingredient.id, reconcile(ingredient))
  }

  const removeIngredient = (id: UUID) => {
    setRecipe("ingredientsOrder", (order) => order.filter((i) => i !== id))
    setRecipe(produce((recipe) => { delete recipe.ingredients[id] }))
  }

  const addInstruction = (afterId: UUID | "") => {
    const id: UUID = uuid()
    setRecipe("instructions", id, {
      id,
      text: "",
      images: []
    })
    setRecipe("instructionsOrder", (order) => {
      if (!afterId || order.length === 0) return [...order, id]
      const index = order.indexOf(afterId)
      const newOrder = [...order]
      newOrder.splice(index + 1, 0, id)
      return newOrder
    })
  }

  const editInstruction = (instruction: Instruction) => {
    setRecipe("instructions", instruction.id, reconcile(instruction))
  }

  const removeInstruction = (id: UUID) => {
    setRecipe("instructionsOrder", (order) => order.filter((i) => i !== id))
    setRecipe(produce((recipe) => {
      delete recipe.instructions[id]
    }))
  }

  const addRecipeImage = (image: RecipeImage) => {
    setRecipe("images", recipe.images.length, image)
  }

  const removeRecipeImage = (index: number) => {
    URL.revokeObjectURL(recipe.images[index].url)
    setRecipe("images", (images) => images.filter((_, i) => i !== index))
  }

  onMount(() => {
    initializeRecipe(createDefaultRecipe())
  })

  return (
    <RecipeContext.Provider value={{
      recipe,
      editName,
      editDescription,
      editRating,
      editPortion,
      editCookTime,
      editDifficulty,
      editSideNotes,
      addIngredient,
      editIngredient,
      removeIngredient,
      addInstruction,
      editInstruction,
      removeInstruction,
      addRecipeImage,
      removeRecipeImage,
      initializeRecipe
    }}>
      {props.children}
    </RecipeContext.Provider>
  )
}
