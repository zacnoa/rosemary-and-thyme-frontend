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
 * Owns the recipe editor's entire editable state and every mutation on it.
 * Every `editX`/`addX`/`removeX` function below is a thin wrapper around a
 * `setRecipe(...)` call using Solid's store path-setter syntax
 * (`setRecipe("ingredients", id, ...)` etc.) rather than replacing whole
 * objects, so that only the DOM bound to the specific path that actually
 * changed re-renders - e.g. editing one ingredient's name doesn't re-render
 * the rest of the ingredient list or any other section of the page. This is
 * also what makes components like IngredientsModule (which read
 * `recipe.ingredients`/`recipe.ingredientsOrder` straight from this store)
 * update live as the user types, with no extra plumbing on their end.
 *
 * "Has this recipe changed since it was last saved" ([changedFlag]) is
 * derived generically from the store itself (see the `createEffect` below)
 * rather than each mutator setting it individually, so no new edit function
 * can forget to mark the recipe dirty.
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
   * Submits the current recipe as `multipart/form-data`: the recipe itself
   * as a JSON blob under the `"recipe"` part, plus one binary part per image
   * that still has a local `blob` (i.e. picked but not yet successfully
   * uploaded/persisted - see model/types/utils.ts for the blob/url split).
   * On success, reconciles the store with the server's response - see
   * [applyServerRecipe].
   *
   * Guarded by two checks *before* any network request is made, both
   * enforced here (not only in SaveModule's slider UI) so this is the one
   * place a save can actually happen from, and nothing can bypass the
   * checks by calling this directly:
   * - `changedFlag()` must be true - nothing to save otherwise, so this
   *   silently no-ops rather than round-tripping an identical recipe.
   * - [getSaveBlockers] must return no blockers (e.g. too many ingredients,
   *   description over the word limit) - if it does, the first one is shown
   *   as an error toast and the save is refused. Mirrored server-side by
   *   RecipeValidation.kt (see RecipeService.saveRecipe on the backend),
   *   which is the check that actually matters - this one just fails fast
   *   without a network round trip.
   *
   * While the request is in flight, a `"loading"` toast is shown via
   * [notify] (see NotificationProvider - that type doesn't auto-dismiss),
   * replaced by the existing success/error toast once the request settles.
   *
   * @param recipe the recipe to save (always the live store, `context.recipe` -
   * taken as a parameter rather than closing over the outer `recipe` purely
   * so callers read naturally as "save this recipe", not because a
   * different recipe is ever actually passed in)
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
   * Reconciles the store with the server's response after a successful save.
   *
   * The backend never reuses a client-submitted id when it inserts a new row
   * (new ingredients/instructions get a DB-generated UUID, new images get
   * their real Cloudinary url - see RecipeRepository.upsertRecipeBase/sync*
   * on the backend). Without this, the store would keep the stale
   * client-side ids/blob previews after save, and the *next* save would
   * treat everything under those stale ids as new again - inserting
   * duplicate rows and re-uploading already-uploaded images every time.
   *
   * Uses `reconcile()` rather than replacing the store outright so that
   * unrelated DOM (anything keyed by an id that didn't change) doesn't get
   * torn down and rebuilt - only the ids/values that actually differ from
   * the server's response are patched in.
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
   * Deletes an image everywhere it might be referenced - a hero image slot,
   * any instruction's image list, and the `images` map itself. Also revokes
   * the image's `blobURL` (if it has one) to free the browser-side object
   * URL, since after this call nothing will hold a reference to it any more.
   *
   * @param id the image id to remove (see model/types/utils.ts's RecipeImage)
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

  /** Appends a new, blank ingredient (client-generated id - see RecipeRepository.upsertRecipeBase on the backend for why the real id only exists after save) to the end of the list. */
  const addIngredient = () => {
    const id: UUID = crypto.randomUUID();
    setRecipe("ingredients", id, { id, name: "", amount: 0, measuringUnit: "" });
    setRecipe("ingredientsOrder", recipe.ingredientsOrder.length, id);
  };

  /** Replaces an ingredient's full value by id (see recipeEditor/Ingredient.tsx, which calls this on every keystroke once its combined name/amount/unit field parses). */
  const editIngredient = (ingredient: Ingredient) => {
    setRecipe("ingredients", ingredient.id, reconcile(ingredient));
  };

  const removeIngredient = (id: UUID) => {
    setRecipe("ingredientsOrder", (order) => order.filter((i) => i !== id));
    setRecipe(produce((recipe) => { delete recipe.ingredients[id]; }));
  };

  /**
   * Appends a new, blank instruction step. Inserted right after `afterId`
   * (so "add step" on step 2 of 5 lands as the new step 3) rather than
   * always at the end.
   *
   * @param afterId the step to insert after, or `""` to append at the end
   * (used when there are no steps yet at all - see recipeEditor/Instructions.tsx)
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

  /** Replaces an instruction's full value by id (text and/or images). */
  const editInstruction = (instruction: Instruction) => {
    setRecipe("instructions", instruction.id, reconcile(instruction));
  };

  /** Adds a freshly-picked image (see recipeEditor/ImageGallery.tsx) to both the shared `images` map and the given instruction's own image list. */
  const addInstructionImage = (image: RecipeImage, instructionId: UUID) => {
    setRecipe("images", image.id, image);
    setRecipe("instructions", instructionId, "images", (images) => [...images, image.id]);
  };

  const removeInstruction = (id: UUID) => {
    setRecipe("instructionsOrder", (order) => order.filter((i) => i !== id));
    setRecipe(produce((recipe) => { delete recipe.instructions[id]; }));
  };

  /** Adds a freshly-picked image to both the `images` map and the end of `heroImagesOrder` (the banner gallery). */
  const addBannerImage = (image: RecipeImage) => {
    setRecipe("images", image.id, image);
    setRecipe("heroImagesOrder", recipe.heroImagesOrder.length, image.id);
  };

  /** @param index the image's position in `heroImagesOrder`, not its id */
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
