import { Plus } from "lucide-solid";
import { createSignal, onMount } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";
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
 */
export default function CreateRecipeButton() {
  const user = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
    };

    const formData = new FormData();
    formData.append(
      "recipe",
      new Blob([JSON.stringify(blankRecipe)], { type: "application/json" })
    );

    const { ok, json } = await putRecipe(tempId, formData);
    setPending(false);

    if (!ok) {
      notify("error", json.detail ?? "Could not create recipe");
      return;
    }

    setName("");
    navigate(`/recipe/${json.id}`);
  };

  onMount(() => {
    registerPanel(PANEL_ID, () => (
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
    ));
  });

  const handleClick = () => {
    if (!user) {
      navigate(loginHref(location.pathname));
      return;
    }
    toggle(PANEL_ID);
  };

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
      onClick={handleClick}
    >
      <Plus color="var(--color-background)" class="md:w-[30px] h-auto" />
    </li>
  );
}
