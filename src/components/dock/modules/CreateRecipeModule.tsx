import { Plus } from "lucide-solid";
import { createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "~/components/auth/context/useAuth";
import { useNotification } from "~/components/notification/context/useNotification";
import { useDock } from "../context/DockContext";

const PANEL_ID = "createRecipe";

export default function CreateRecipeButton() {
  const user = useAuth();
  const navigate = useNavigate();
  const { notify } = useNotification();
  const { toggle, activePanel, registerPanel } = useDock();
  const [name, setName] = createSignal("");
  const [pending, setPending] = createSignal(false);

  const createRecipe = async () => {
    const trimmedName = name().trim();
    if (!trimmedName || pending() || !user) return;
    setPending(true);

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

    const result = await fetch(`http://localhost:8080/recipe/${tempId}`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });
    const json = await result.json();
    setPending(false);

    if (!result.ok) {
      notify("error", json.detail ?? "Could not create recipe");
      return;
    }

    setName("");
    navigate(`/recipe/${json.id}`);
  };

  onMount(() => {
    registerPanel(PANEL_ID, () => (
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
    ));
  });

  const handleClick = () => {
    if (!user) {
      navigate("/auth/login");
      return;
    }
    toggle(PANEL_ID);
  };

  return (
    <li
      class="ml-auto rounded-full p-1 cursor-pointer bg-linear-to-r from-green to-orange"
      onClick={handleClick}
    >
      <Plus color="var(--color-background)" class="md:w-[30px] h-auto" />
    </li>
  );
}
