import { Moon, MoreVertical, Sun } from "lucide-solid";
import { createSignal, onMount, Show } from "solid-js";
import { useDock } from "../context/DockContext";

const PANEL_ID = "more";

/**
 * Provides the MoreModule function.
 */
export default function MoreModule() {
  const { toggle, activePanel, registerPanel } = useDock();
  const [theme, setTheme] = createSignal<"dark" | "light">("dark");

  const toggleTheme = () => {
    const next = theme() === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  onMount(() => {
    registerPanel(PANEL_ID, () => (
      <ul class="flex flex-col gap-3 text-background list-none">
        <li>
          <button
            type="button"
            onClick={toggleTheme}
            class="flex items-center gap-2 cursor-pointer"
          >
            <Show
              when={theme() === "dark"}
              fallback={<Sun color="var(--color-background)" class="size-5" />}
            >
              <Moon color="var(--color-background)" class="size-5" />
            </Show>
            {theme() === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          </button>
        </li>
      </ul>
    ));
  });

  return (
    <li
      class={`rounded-md p-1 cursor-pointer ${activePanel() === PANEL_ID ? "bg-gray" : "bg-foreground"
        }`}
      onClick={() => toggle(PANEL_ID)}
    >
      <MoreVertical color="var(--color-background)" class="md:w-[30px] h-auto" />
    </li>
  );
}
