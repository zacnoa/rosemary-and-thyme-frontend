import { Search } from "lucide-solid";
import { onMount } from "solid-js";
import { useDock } from "../DockContext";

const PANEL_ID = "search";

export default function SearchModule() {
  const { toggle, activePanel, registerPanel } = useDock();

  onMount(() => {
    registerPanel(PANEL_ID, () => (
      <input
        type="text"
        class="w-full p-2 text-background border-2 rounded-2xl border-background"
        placeholder="Search your recipes"
      />
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
