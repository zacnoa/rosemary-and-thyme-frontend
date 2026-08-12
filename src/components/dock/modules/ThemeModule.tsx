import { Moon, Sun } from "lucide-solid";
import { createSignal, Show } from "solid-js";

/**
 * Dark/light theme toggle. Sets `data-theme` on `<html>`, which app.css's
 * `[data-theme="light"]` selector overrides the (dark-by-default) `@theme`
 * color tokens under.
 *
 * The `theme` signal starts at `"dark"` unconditionally rather than reading
 * any persisted preference (e.g. `localStorage` or `prefers-color-scheme`),
 * so the choice doesn't survive a page reload/new session.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = createSignal<"dark" | "light">("dark");

  const toggleTheme = () => {
    const next = theme() === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <li class="bg-foreground p-1 rounded-md cursor-pointer" onClick={toggleTheme}>
      <Show
        when={theme() === "dark"}
        fallback={<Sun color="var(--color-background)" class="md:w-[30px] h-auto" />}
      >
        <Moon color="var(--color-background)" class="md:w-[30px] h-auto" />
      </Show>
    </li>
  );
}
