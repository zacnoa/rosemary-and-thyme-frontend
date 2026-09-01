import { Plus } from "lucide-solid";
import { createSignal, onMount, Show } from "solid-js";
import { A, useLocation, useNavigate } from "@solidjs/router";
import { useAuth } from "~/components/auth/context/useAuth";
import { useNotification } from "~/components/notification/context/useNotification";
import { useDock } from "../context/DockContext";
import { putRecipe } from "~/queries/putRecipe";
import { loginHref } from "~/utils/loginRedirect";

const PANEL_ID = "createRecipe";

/**
 * "New recipe" panel: takes just a name, then does a full save immediately
 * (there's no separate "create" endpoint on the backend - see the TODO in
 * RecipeService - so this reuses the same `PUT /recipe/{id}` upsert path
 * saving from the editor does, with everything but the name left blank).
 *
 * Signed-out visitors get the panel too, not a redirect to `/auth/login` -
 * it just shows why creating is unavailable (with a login link) instead of
 * silently bouncing them away, which used to leave no explanation for why
 * clicking "+" left the page.
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

    // Only used to steer RecipeRepository.upsertRecipeBase onto its insert
    // branch (no existing row has this id) - the backend never actually
    // persists a client-submitted id for a new row, so the real id comes
    // back as json.id below and this one is discarded.
    const tempId = crypto.randomUUID();
    const blankRecipe = {
      id: tempId,
      userId: user.id,
      userName: user.username,
      createDate: new Date().toISOString().slice(0, 10),
      name: trimmedName,
      description: "",
      likes: 0,
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
      isPrivate: false,
    };

    const formData = new FormData();
    formData.append(
      "recipe",
      new Blob([JSON.stringify(blankRecipe)], { type: "application/json" })
    );

    // try/finally - a network failure or non-JSON error body rejects the
    // promise rather than returning a value; without this the button would
    // stay stuck on "Creating..." forever with no indication anything went wrong.
    try {
      const { ok, json } = await putRecipe(tempId, formData);

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
            <p class="text-fluid-sm-base">
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
          <label for="new-recipe-name" class="text-fluid-sm-base">
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
    // No ml-auto here (there used to be one): Dock.tsx's <ul> is already
    // justify-between, which spreads every module evenly on its own - an
    // ml-auto on just this last item fought that by pulling *all* the
    // wrapper's leftover width into one gap right before this button
    // specifically, instead of it being distributed across every gap. Only
    // showed up on mobile, where the dock's wrapper is a fixed w-[92vw]
    // (wider than the icons' natural content width) - on desktop the
    // wrapper is content-width (md:w-auto), so there was never any leftover
    // space for ml-auto to consume there in the first place.
    <li
      class="rounded-full p-1 cursor-pointer bg-linear-to-r from-green to-orange"
      onClick={() => toggle(PANEL_ID)}
    >
      <Plus color="var(--color-background)" class="md:w-[30px] h-auto" />
    </li>
  );
}
