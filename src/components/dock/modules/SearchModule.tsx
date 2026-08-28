import { Search } from "lucide-solid";
import { createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useDock } from "../context/DockContext";

const PANEL_ID = "search";

/**
 * Search entry point over *every* user's recipes - the dock bar's own search icon is
 * present on every dock configuration (Home/Blog/Editor), so it needs to behave the
 * way a bare "search" icon in a dock intuitively reads: search everything, not just
 * whatever's signed in.
 *
 * Doesn't run the search or render results itself - it just takes a query and sends
 * the visitor to `/?query=...` (see routes/index.tsx / components/home/RecipeSearch.tsx),
 * which already renders full RecipePost cards (name, description, image, likes,
 * author) via the same `GET /recipe/search` endpoint. A bare title-only list inside
 * this small dock panel wasn't enough to tell recipes apart, especially with several
 * similarly-named ones - the home page's feed already solves that, so this just
 * reuses it instead of duplicating a second, thinner results view.
 *
 * The "my own recipes only" search lives on the dashboard instead (see
 * components/dashboard/RecipeSearch.tsx / queries/searchUserFeed.ts) - that one's
 * scoping is just as intuitive, since the whole page is already "your recipes".
 */
export default function SearchModule() {
  const { toggle, activePanel, registerPanel } = useDock();
  const navigate = useNavigate();
  const [query, setQuery] = createSignal("");

  const submit = () => {
    const trimmed = query().trim();
    toggle(PANEL_ID);
    navigate(trimmed ? `/?query=${encodeURIComponent(trimmed)}` : "/");
  };

  onMount(() => {
    registerPanel(PANEL_ID, () => (
      <div class="flex flex-col gap-3 text-background">
        <input
          type="text"
          value={query()}
          onInput={(e) => setQuery(e.currentTarget.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          class="w-full p-2 text-background border-2 rounded-2xl border-background outline-none bg-transparent"
          placeholder="Search all recipes"
        />
        <button
          type="button"
          onClick={submit}
          class="self-start px-3 py-1 rounded-md bg-linear-to-r from-green to-orange cursor-pointer font-bold"
        >
          Search
        </button>
      </div>
    ));
  });

  return (
    <li
      class={`rounded-md p-1 cursor-pointer ${activePanel() === PANEL_ID ? "bg-orange" : "bg-foreground"
        }`}
      onClick={() => toggle(PANEL_ID)}
    >
      <Search color="var(--color-background)" class="md:w-[30px] h-auto" />
    </li>
  );
}
