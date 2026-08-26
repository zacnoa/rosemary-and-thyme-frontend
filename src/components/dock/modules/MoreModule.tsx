import { Moon, MoreVertical, Sun } from "lucide-solid";
import { createSignal, onMount, Show } from "solid-js";
import { useDock } from "../context/DockContext";

const PANEL_ID = "more";

/**
 * Catch-all settings panel, opened from a vertical "..." bar icon rather than
 * getting its own permanent icon per setting - today that's just the dark/light
 * theme toggle (folded in from the old standalone `ThemeModule` bar icon), but the
 * panel shape is meant to grow: any future per-viewer preference belongs inside
 * this panel instead of adding yet another icon to an already-crowded bar
 * (EditorDock renders 7 of them even after this).
 *
 * The `theme` signal starts at `"dark"` unconditionally rather than reading any
 * persisted preference (e.g. `localStorage` or `prefers-color-scheme`), so the
 * choice doesn't survive a page reload/new session - same as the old ThemeModule.
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
