import { Plus } from "lucide-solid";
import { createSignal, onMount, Show } from "solid-js";
import { A, useLocation, useNavigate } from "@solidjs/router";
import { useAuth } from "~/components/auth/context/useAuth";
import { useNotification } from "~/components/notification/context/useNotification";
import { useDock } from "../context/DockContext";
import { postRecipe } from "~/queries/postRecipe";
import { loginHref } from "~/utils/loginRedirect";
import type { RecipeWriteDTO } from "~/model/types/utils";

const PANEL_ID = "createRecipe";

/**
 * Provides the CreateRecipeButton function.
 */
export default function CreateRecipeButton() {
  const user = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { notify } = useNotification();
  const { toggle, registerPanel } = useDock();
  const [name, setName] = createSignal("");
  const [pending, setPending] = createSignal(false);

  const createRecipe = async () => {
    const trimmedName = name().trim();
    if (!trimmedName || pending() || !user) return;
    setPending(true);

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
      setPending(false);
    }
  };

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
        <div class="flex flex-col gap-3 text-background">
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
            disabled={pending() || !name().trim()}
            class="self-start px-3 py-1 rounded-md bg-linear-to-r from-green to-orange cursor-pointer disabled:opacity-50"
            onClick={createRecipe}
          >
            {pending() ? "Creating..." : "Create"}
          </button>
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
