import { Moon, Sun } from "lucide-solid";
import { createSignal, Show } from "solid-js";

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
