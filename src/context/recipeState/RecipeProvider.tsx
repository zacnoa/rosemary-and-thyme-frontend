import { createEffect, createSignal, on, ParentProps, Show } from "solid-js";
import { createStore, produce, reconcile } from "solid-js/store";
import { RecipeContext } from "./recipeContext";
import { Recipe } from "~/model/interfaces/Recipe";
import { UUID } from "~/model/types/UUID";
import { Ingredient, Instruction } from "~/model/types/recipeTypes";
import { RecipeImage, stripBlobData } from "~/model/types/utils";
import ImageViewer from "~/components/recipeEditor/ImageViewer";




interface RecipeProviderProps extends ParentProps {
  initialRecipe: Recipe;
}

export default function RecipeProvider(props: RecipeProviderProps) {

  const [recipe, setRecipe] = createStore<Recipe>(props.initialRecipe);
  const [viewerImages, setViewerImages] = createSignal<{ images: UUID[], initialIndex?: number } | null>(null);
  const [changedFlag, setChangedFlag] = createSignal<boolean>(false);

  const saveRecipe = async (recipe: Recipe) => {
    const formData = new FormData();

    // recipe JSON bez blob podataka
    const recipeDTO = stripBlobData(recipe);

    // eksplicitno postavi content-type na application/json
    const recipeBlob = new Blob([JSON.stringify(recipeDTO)], { type: "application/json" });
    formData.append("recipe", recipeBlob);

    // slike kao binarne
    Object.entries(recipe.images).forEach(([id, img]) => {
      if (img.blob) {
        formData.append(`images[${id}]`, img.blob, id);
      }
    });

    const result = await fetch(`http://localhost:8080/recipe/${recipe.id}`, {
      method: "PUT",
      body: formData
      // NE setaš Content-Type, browser sam postavi boundary
    });
    console.log(result)
  }

  createEffect(on(() => JSON.stringify(recipe), () => {
    setChangedFlag(true);
  }, { defer: true }))


  const openViewer = (images: UUID[], initialIndex: number = 0) => setViewerImages({ images: images, initialIndex: initialIndex });
  const closeViewer = () => setViewerImages(null);

  const removeImage = (id: UUID) => {
    // ukloni iz heroImagesOrder ako postoji
    setRecipe("heroImagesOrder", (order) => order.filter((i) => i !== id));

    // ukloni iz svih instruction images
    setRecipe("instructions", (instructions) => {
      const updated = { ...instructions };
      for (const key in updated) {
        updated[key] = {
          ...updated[key],
          images: updated[key].images.filter((i) => i !== id)
        };
      }
      return updated;
    });

    // ukloni iz images mape
    setRecipe(produce((r) => {
      const img = r.images[id];
      if (img?.blobURL) URL.revokeObjectURL(img.blobURL);
      delete r.images[id];
    }));

    // updateaj viewer images ako je otvoren
    setViewerImages((imgs) => {
      if (!imgs) return null;
      const updated = imgs.images.filter((i) => i !== id); // ✅ imgs.images
      return updated.length > 0
        ? { ...imgs, images: updated } // ✅ zadrži initialIndex
        : null;
    });
  };

  const editName = (text: string) => setRecipe("name", text);
  const editDescription = (text: string) => setRecipe("description", text);
  const editRating = (rating: number) => setRecipe("likes", rating);
  const editPortion = (portion: number) => setRecipe("portions", portion);
  const editCookTime = (text: string) => setRecipe("cookTime", text);
  const editDifficulty = (difficulty: number) => setRecipe("difficulty", difficulty);
  const editSideNotes = (text: string) => setRecipe("sideNotes", text);

  const addIngredient = () => {
    const id: UUID = crypto.randomUUID();
    setRecipe("ingredients", id, { id, name: "", amount: 0, measuringUnit: "" });
    setRecipe("ingredientsOrder", recipe.ingredientsOrder.length, id);
  };

  const editIngredient = (ingredient: Ingredient) => {
    setRecipe("ingredients", ingredient.id, reconcile(ingredient));
  };

  const removeIngredient = (id: UUID) => {
    setRecipe("ingredientsOrder", (order) => order.filter((i) => i !== id));
    setRecipe(produce((recipe) => { delete recipe.ingredients[id]; }));
  };

  const addInstruction = (afterId: UUID | "") => {
    const id: UUID = crypto.randomUUID();
    setRecipe("instructions", id, { id, text: "", images: [] });
    setRecipe("instructionsOrder", (order) => {
      if (!afterId || order.length === 0) return [...order, id];
      const index = order.indexOf(afterId);
      const newOrder = [...order];
      newOrder.splice(index + 1, 0, id);
      return newOrder;
    });
  };

  const editInstruction = (instruction: Instruction) => {
    setRecipe("instructions", instruction.id, reconcile(instruction));
  };

  const addInstructionImage = (image: RecipeImage, instructionId: UUID) => {
    setRecipe("images", image.id, image);
    setRecipe("instructions", instructionId, "images", (images) => [...images, image.id]);
  };

  const removeInstruction = (id: UUID) => {
    setRecipe("instructionsOrder", (order) => order.filter((i) => i !== id));
    setRecipe(produce((recipe) => { delete recipe.instructions[id]; }));
  };

  const addBannerImage = (image: RecipeImage) => {
    setRecipe("images", image.id, image);
    setRecipe("heroImagesOrder", recipe.heroImagesOrder.length, image.id);
  };

  const removeBannerImage = (index: number) => {
    const imageId = recipe.heroImagesOrder[index];
    const image = recipe.images[imageId];
    if (image.blobURL) URL.revokeObjectURL(image.blobURL);
    setRecipe("heroImagesOrder", (images) => images.filter((_, i) => i !== index));
    setRecipe(produce((recipe) => { delete recipe.images[imageId]; }));
  };

  return (
    <RecipeContext.Provider value={{
      recipe,
      changedFlag,
      viewerImages,
      openViewer,
      closeViewer,
      removeImage,
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
      saveRecipe
    }}>
      {props.children}
      <Show when={viewerImages()?.images}>
        <ImageViewer
          images={viewerImages()!.images}
          initialIndex={viewerImages()?.initialIndex}
          onDelete={removeImage}
          onClose={closeViewer}
        />
      </Show>
    </RecipeContext.Provider>
  );
}
