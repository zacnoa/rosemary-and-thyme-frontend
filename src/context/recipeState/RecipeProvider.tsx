import { ParentProps } from "solid-js";
import { createStore, produce, reconcile } from "solid-js/store";
import { RecipeContext } from "./recipeContext";
import { Recipe } from "~/model/interfaces/Recipe";
import { UUID } from "~/model/types/UUID";
import { Ingredient, Instruction } from "~/model/types/recipeTypes";
import { RecipeImage } from "~/model/types/utils";

interface RecipeProviderProps extends ParentProps {
  initialRecipe: Recipe;
}

export default function RecipeProvider(
  props: RecipeProviderProps
) {

  const [recipe, setRecipe] = createStore<Recipe>(props.initialRecipe);

  const editName = (text: string) => {
    setRecipe("name", text);
  };

  const editDescription = (text: string) => {
    setRecipe("description", text);
  };

  const editRating = (rating: number) => {
    setRecipe("likes", rating);
  };

  const editPortion = (portion: number) => {
    setRecipe("portions", portion);
  };

  const editCookTime = (text: string) => {
    setRecipe("cookTime", text);
  };

  const editDifficulty = (difficulty: number) => {
    setRecipe("difficulty", difficulty);
  };

  const editSideNotes = (text: string) => {
    setRecipe("sideNotes", text);
  };

  const addIngredient = () => {
    const id: UUID = crypto.randomUUID();

    setRecipe("ingredients", id, {
      id,
      name: "",
      amount: 0,
      measuringUnit: "",
    });

    setRecipe(
      "ingredientsOrder",
      recipe.ingredientsOrder.length,
      id
    );
  };

  const editIngredient = (ingredient: Ingredient) => {
    setRecipe(
      "ingredients",
      ingredient.id,
      reconcile(ingredient)
    );
  };

  const removeIngredient = (id: UUID) => {
    setRecipe(
      "ingredientsOrder",
      (order) => order.filter((i) => i !== id)
    );

    setRecipe(produce((recipe) => {
      delete recipe.ingredients[id];
    }));
  };

  const addInstruction = (afterId: UUID | "") => {
    const id: UUID = crypto.randomUUID();

    setRecipe("instructions", id, {
      id,
      text: "",
      images: []
    });

    setRecipe("instructionsOrder", (order) => {
      if (!afterId || order.length === 0) {
        return [...order, id];
      }

      const index = order.indexOf(afterId);

      const newOrder = [...order];

      newOrder.splice(index + 1, 0, id);

      return newOrder;
    });
  };

  const editInstruction = (instruction: Instruction) => {
    setRecipe(
      "instructions",
      instruction.id,
      reconcile(instruction)
    );
  };

  const addInstructionImage = (
    image: RecipeImage,
    instructionId: UUID
  ) => {
    setRecipe("images", image.id, image);

    setRecipe(
      "instructions",
      instructionId,
      "images",
      (images) => [...images, image.id]
    );
  };

  const removeInstruction = (id: UUID) => {
    setRecipe(
      "instructionsOrder",
      (order) => order.filter((i) => i !== id)
    );

    setRecipe(produce((recipe) => {
      delete recipe.instructions[id];
    }));
  };

  const addBannerImage = (image: RecipeImage) => {
    setRecipe("images", image.id, image);

    setRecipe(
      "heroImagesOrder",
      recipe.heroImagesOrder.length,
      image.id
    );
  };

  const removeBannerImage = (index: number) => {
    const imageId = recipe.heroImagesOrder[index];

    const image = recipe.images[imageId];

    if (image.blobURL) {
      URL.revokeObjectURL(image.blobURL);
    }

    setRecipe(
      "heroImagesOrder",
      (images) => images.filter((_, i) => i !== index)
    );

    setRecipe(produce((recipe) => {
      delete recipe.images[imageId];
    }));
  };

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
      addInstructionImage,
      removeInstruction,
      addBannerImage,
      removeBannerImage,
    }}>
      {props.children}
    </RecipeContext.Provider>
  );
}
