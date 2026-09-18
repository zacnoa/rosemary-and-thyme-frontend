import { Plus } from "lucide-solid";
import { createSignal, JSX, onCleanup, onMount, Show } from "solid-js";
import { A, useLocation, useNavigate } from "@solidjs/router";
import { useAuth } from "~/components/auth/context/useAuth";
import { useNotification } from "~/components/notification/context/useNotification";
import { useDock } from "../context/DockContext";
import { postRecipe } from "~/queries/postRecipe";
import { extractRecipe } from "~/queries/extractRecipe";
import { loginHref } from "~/utils/loginRedirect";
import type { RecipeWriteDTO } from "~/model/types/utils";

const PANEL_ID = "createRecipe";
const MAX_RECIPE_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
const ACCEPTED_RECIPE_IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);
type PendingAction = "blank" | "extract" | null;

/** Provides the CreateRecipeButton function. */
export default function CreateRecipeButton() {
  const user = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { notify } = useNotification();
  const { toggle, registerPanel } = useDock();
  const [name, setName] = createSignal("");
  const [pendingAction, setPendingAction] = createSignal<PendingAction>(null);
  const [recipeImage, setRecipeImage] = createSignal<File | null>(null);
  const [previewUrl, setPreviewUrl] = createSignal<string | null>(null);
  let recipeImageInput: HTMLInputElement | undefined;

  const clearRecipeImage = () => {
    const currentPreviewUrl = previewUrl();
    if (currentPreviewUrl) URL.revokeObjectURL(currentPreviewUrl);
    setPreviewUrl(null);
    setRecipeImage(null);
    if (recipeImageInput) recipeImageInput.value = "";
  };

  const selectRecipeImage: JSX.EventHandler<HTMLInputElement, Event> = (event) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    if (!ACCEPTED_RECIPE_IMAGE_TYPES.has(file.type)) {
      notify("error", "Please choose a JPG or PNG image");
      event.currentTarget.value = "";
      return;
    }
    if (file.size > MAX_RECIPE_IMAGE_SIZE_BYTES) {
      notify("error", "The recipe image must be 8 MB or smaller");
      event.currentTarget.value = "";
      return;
    }

    const currentPreviewUrl = previewUrl();
    if (currentPreviewUrl) URL.revokeObjectURL(currentPreviewUrl);
    setRecipeImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const createRecipeFromImage = async () => {
    const image = recipeImage();
    if (!image || pendingAction() || !user) return;

    setPendingAction("extract");
    notify("loading", "Reading your recipe and creating a private draft...");

    try {
      const { ok, json } = await extractRecipe(image);
      if (!ok) {
        notify("error", json.detail ?? "Could not create a recipe from this image");
        return;
      }

      clearRecipeImage();
      notify("success", "Private recipe draft created — review it carefully before publishing");
      navigate(`/recipe/${json.id}`);
    } catch {
      notify("error", "Could not reach the server - check your connection and try again");
    } finally {
      setPendingAction(null);
    }
  };

  const createRecipe = async () => {
    const trimmedName = name().trim();
    if (!trimmedName || pendingAction() || !user) return;
    setPendingAction("blank");

    const blankRecipe: RecipeWriteDTO = {
      name: trimmedName,
      description: "",
      portions: 1,
      cookTime: "",
      difficulty: 1,
      sideNotes: "",
      images: {},
      ingredients: {},
      instructions: {},
      ingredientsOrder: [],
      instructionsOrder: [],
      heroImagesOrder: [],
    };

    const formData = new FormData();
    formData.append(
      "recipe",
      new Blob([JSON.stringify(blankRecipe)], { type: "application/json" })
    );

    try {
      const { ok, json } = await postRecipe(formData);

      if (!ok) {
        notify("error", json.detail ?? "Could not create recipe");
        return;
      }

      setName("");
      navigate(`/recipe/${json.id}`);
    } catch {
      notify("error", "Could not reach the server - check your connection and try again");
    } finally {
      setPendingAction(null);
    }
  };

  onCleanup(() => {
    const currentPreviewUrl = previewUrl();
    if (currentPreviewUrl) URL.revokeObjectURL(currentPreviewUrl);
  });

  onMount(() => {
    registerPanel(PANEL_ID, () => (
      <Show
        when={user}
        fallback={
          <div class="flex flex-col gap-3 text-background">
            <p class="text-sm md:text-base">
              You need to be logged in to create a recipe.
            </p>
            <A
              href={loginHref(location.pathname)}
              class="self-start px-3 py-1 rounded-md bg-linear-to-r from-green to-orange cursor-pointer font-bold"
            >
              Log in
            </A>
          </div>
        }
      >
        <div class="flex flex-col gap-4 text-background">
          <section class="flex flex-col gap-3">
            <div>
              <h3 class="font-bold text-base md:text-lg">
                Turn a recipe photo into an editable draft
              </h3>
              <p class="text-sm opacity-80 mt-1">
                Upload or photograph a printed or handwritten recipe. We’ll create a private digital version for you to review and edit.
              </p>
            </div>

            <input
              ref={recipeImageInput}
              id="recipe-image-upload"
              class="hidden"
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              disabled={pendingAction() !== null}
              onChange={selectRecipeImage}
            />
            <label
              for="recipe-image-upload"
              class={`self-start px-3 py-2 rounded-md bg-linear-to-r from-green to-orange font-bold ${pendingAction() ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {recipeImage() ? "Choose a different photo" : "Choose or take a photo"}
            </label>

            <Show when={previewUrl()}>
              {(url) => (
                <div class="flex flex-col gap-2">
                  <img
                    src={url()}
                    alt="Selected recipe preview"
                    class="w-full max-h-52 object-contain rounded-md bg-foreground"
                  />
                  <div class="flex items-center justify-between gap-3 text-sm">
                    <span class="truncate" title={recipeImage()?.name}>
                      {recipeImage()?.name}
                    </span>
                    <button
                      type="button"
                      class="underline cursor-pointer disabled:opacity-50"
                      disabled={pendingAction() !== null}
                      onClick={clearRecipeImage}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </Show>

            <div class="border border-orange rounded-md p-3 text-sm">
              <p class="font-bold">Review the result carefully</p>
              <p class="opacity-80 mt-1">
                AI extraction is not guaranteed to be accurate. Check every ingredient, quantity, cooking time, and instruction, then correct anything that was read incorrectly.
              </p>
            </div>

            <p class="text-xs opacity-70">
              For the best result, use a clear, well-lit photo with the entire recipe visible and the page as straight as possible. JPG or PNG, up to 8 MB. You can create up to two digital drafts per day.
            </p>

            <button
              type="button"
              disabled={!recipeImage() || pendingAction() !== null}
              class="self-start px-3 py-2 rounded-md bg-linear-to-r from-green to-orange cursor-pointer font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={createRecipeFromImage}
            >
              {pendingAction() === "extract" ? "Creating your digital draft..." : "Create digital recipe"}
            </button>
          </section>

          <div class="flex items-center gap-3" aria-hidden="true">
            <div class="h-px flex-1 bg-background opacity-40" />
            <span class="text-xs uppercase tracking-wide opacity-70">or start from scratch</span>
            <div class="h-px flex-1 bg-background opacity-40" />
          </div>

          <section class="flex flex-col gap-3">
            <label for="new-recipe-name" class="text-sm md:text-base">
              Recipe name
            </label>
            <input
              id="new-recipe-name"
              type="text"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              onKeyDown={(e) => e.key === "Enter" && createRecipe()}
              placeholder="e.g. Grandma's Apple Pie"
              class="outline-none bg-transparent border-b-2 border-background py-1 text-base"
            />
            <button
              type="button"
              disabled={pendingAction() !== null || !name().trim()}
              class="self-start px-3 py-1 rounded-md bg-linear-to-r from-green to-orange cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={createRecipe}
            >
              {pendingAction() === "blank" ? "Creating..." : "Create blank recipe"}
            </button>
          </section>
        </div>
      </Show>
    ));
  });

  return (
    <li
      class="rounded-full p-1 cursor-pointer bg-linear-to-r from-green to-orange"
      onClick={() => toggle(PANEL_ID)}
    >
      <Plus color="var(--color-background)" class="md:w-[30px] h-auto" />
    </li>
  );
}
