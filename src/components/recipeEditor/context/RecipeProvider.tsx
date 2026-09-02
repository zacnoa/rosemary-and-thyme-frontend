import { createEffect, createSignal, on, ParentProps } from "solid-js";
import { createStore, produce, reconcile } from "solid-js/store";
import { RecipeContext } from "./recipeContext";
import { Recipe } from "~/model/interfaces/Recipe";
import { UUID } from "~/model/types/UUID";
import { Ingredient, Instruction } from "~/model/types/recipeTypes";
import { RecipeDTO, RecipeImage, stripBlobData } from "~/model/types/utils";
import { useNotification } from "~/components/notification/context/useNotification";
import { putRecipe } from "~/queries/putRecipe";
import { getSaveBlockers } from "~/utils/validateRecipe";




interface RecipeProviderProps extends ParentProps {
  initialRecipe: Recipe;
}

/**
 * Provides the RecipeProvider function.
 */
export default function RecipeProvider(props: RecipeProviderProps) {

  const [recipe, setRecipe] = createStore<Recipe>(props.initialRecipe);
  const [changedFlag, setChangedFlag] = createSignal<boolean>(false);
  const { notify } = useNotification();

  // Set (synchronously, before the reconcile()) whenever applyServerRecipe
  // mutates the store, and read by the "did the recipe change" effect below
  // (which only runs after that mutation is flushed) so the post-save
  // reconcile doesn't itself flip changedFlag back to true right after
  // saveRecipe just set it to false.
  let applyingServerRecipe = false;

  /**
 * Provides the saveRecipe function.
 */
  const saveRecipe = async (recipe: Recipe) => {
    if (!changedFlag()) return;

    const blockers = getSaveBlockers(recipe);
    if (blockers.length > 0) {
      notify("error", blockers[0]);
      return;
    }

    notify("loading", "Saving...");

    const formData = new FormData();

    // recipe JSON without the blob data - the backend only wants the
    // (already-uploaded) url, never the raw file object
    const recipeDTO = stripBlobData(recipe);

    // explicitly set the content-type so the backend can tell this part
    // apart from the image parts
    const recipeBlob = new Blob([JSON.stringify(recipeDTO)], { type: "application/json" });
    formData.append("recipe", recipeBlob);

    // images as binary parts, keyed by image id so the backend can match
    // each upload back to the RecipeImageDTO with the same id in "recipe"
    Object.entries(recipe.images).forEach(([id, img]) => {
      if (img.blob) {
        formData.append(id, img.blob);
      }
    });

    // try/catch - a network failure or non-JSON error body rejects the
    // promise rather than returning a value; without this the "loading" toast
    // above (which doesn't auto-dismiss) would stay up forever with no error shown.
    try {
      const { ok, json } = await putRecipe(recipe.id, formData);

      if (!ok) {
        notify("error", json.detail ?? "Saving failed");
        return;
      }

      applyServerRecipe(json as RecipeDTO);
      setChangedFlag(false);
      notify("success", "Saving successful");
    } catch {
      notify("error", "Could not reach the server - check your connection and try again");
    }
  }

  /**
 * Provides the applyServerRecipe function.
 */
  const applyServerRecipe = (dto: RecipeDTO) => {
    // release the object URLs created for local previews - superseded by
    // the server's own urls now that the images are actually persisted
    Object.values(recipe.images).forEach((img) => {
      if (img.blobURL) URL.revokeObjectURL(img.blobURL);
    });

    const images: Record<UUID, RecipeImage> = Object.fromEntries(
      Object.entries(dto.images).map(([id, img]) => [
        id,
        { id: img.id, url: img.url, blob: null, blobURL: null }
      ])
    );

    applyingServerRecipe = true;
    setRecipe(reconcile({
      ...dto,
      createDate: new Date(dto.createDate),
      images,
    }));
  };

  // The single source of truth for "is there anything unsaved": fires on
  // *any* change to the store, however it happened, rather than being set
  // by each individual edit function - `{ defer: true }` skips the initial
  // run (the store's first value shouldn't count as a "change"). Guarded by
  // applyingServerRecipe so applyServerRecipe's own store write (which is a
  // change too, as far as this effect can tell) doesn't undo the
  // setChangedFlag(false) that saveRecipe just did.
  createEffect(on(() => JSON.stringify(recipe), () => {
    if (applyingServerRecipe) {
      applyingServerRecipe = false;
      return;
    }
    setChangedFlag(true);
  }, { defer: true }))


  /**
 * Provides the removeImage function.
 */
  const removeImage = (id: UUID) => {
    // drop it from heroImagesOrder, if present there
    setRecipe("heroImagesOrder", (order) => order.filter((i) => i !== id));

    // drop it from every instruction's image list
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

    // remove it from the images map, releasing its object URL first
    setRecipe(produce((r) => {
      const img = r.images[id];
      if (img?.blobURL) URL.revokeObjectURL(img.blobURL);
      delete r.images[id];
    }));
  };

  const editName = (text: string) => setRecipe("name", text);
  const editDescription = (text: string) => setRecipe("description", text);
  const editRating = (rating: number) => setRecipe("likes", rating);
  const editPortion = (portion: number) => setRecipe("portions", portion);
  const editCookTime = (text: string) => setRecipe("cookTime", text);
  const editDifficulty = (difficulty: number) => setRecipe("difficulty", difficulty);
  const editSideNotes = (text: string) => setRecipe("sideNotes", text);

  /**
 * Provides the addIngredient function.
 */
  const addIngredient = () => {
    const id: UUID = crypto.randomUUID();
    setRecipe("ingredients", id, { id, name: "", amount: 0, measuringUnit: "" });
    setRecipe("ingredientsOrder", recipe.ingredientsOrder.length, id);
  };

  /**
 * Provides the editIngredient function.
 */
  const editIngredient = (ingredient: Ingredient) => {
    setRecipe("ingredients", ingredient.id, reconcile(ingredient));
  };

  const removeIngredient = (id: UUID) => {
    setRecipe("ingredientsOrder", (order) => order.filter((i) => i !== id));
    setRecipe(produce((recipe) => { delete recipe.ingredients[id]; }));
  };

  /**
 * Provides the addInstruction function.
 */
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

  /**
 * Provides the editInstruction function.
 */
  const editInstruction = (instruction: Instruction) => {
    setRecipe("instructions", instruction.id, reconcile(instruction));
  };

  /**
 * Provides the addInstructionImage function.
 */
  const addInstructionImage = (image: RecipeImage, instructionId: UUID) => {
    setRecipe("images", image.id, image);
    setRecipe("instructions", instructionId, "images", (images) => [...images, image.id]);
  };

  const removeInstruction = (id: UUID) => {
    setRecipe("instructionsOrder", (order) => order.filter((i) => i !== id));
    setRecipe(produce((recipe) => { delete recipe.instructions[id]; }));
  };

  /**
 * Provides the addBannerImage function.
 */
  const addBannerImage = (image: RecipeImage) => {
    setRecipe("images", image.id, image);
    setRecipe("heroImagesOrder", recipe.heroImagesOrder.length, image.id);
  };

  /**
 * Provides the removeBannerImage function.
 */
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
      saveBlockers: () => getSaveBlockers(recipe),
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
    </RecipeContext.Provider>
  );
}
