import { createSignal, createMemo, JSX, ParentProps, Show } from "solid-js";
import { DockContext } from "./context/DockContext";

export default function Dock(props: ParentProps) {
  const [activePanel, setActivePanel] = createSignal<string | null>(null);
  const [panels, setPanels] = createSignal<Record<string, () => JSX.Element>>({});

  const toggle = (id: string) => {
    setActivePanel((prev) => (prev === id ? null : id));
  };

  const registerPanel = (id: string, content: () => JSX.Element) => {
    setPanels((prev) => ({ ...prev, [id]: content }));
  };

  const activeContent = createMemo(() => {
    const id = activePanel();
    if (!id) return null;
    return panels()[id]?.() ?? null;
  });

  /**
   * Because DockContext is not reliant on any external calls for its state we forego a separate DockProvider.ts file
   */
  return (
    <DockContext.Provider value={{ activePanel, toggle, registerPanel, panels }}>
      <div class="relative w-full">

        {/* Single shared panel */}
        <div class="pointer-events-none absolute bottom-full w-full overflow-hidden h-40 translate-y-2">
          <div
            class={`w-full h-full transition-transform duration-300 ${activePanel() !== null
              ? "translate-y-0 pointer-events-auto"
              : "translate-y-full"
              }`}
          >
            <div class="bg-foreground3 rounded-t-2xl p-3 pb-4 w-full h-full overflow-y-auto">
              <Show when={activeContent()}>
                {activeContent()}
              </Show>
            </div>
          </div>
        </div>

        {/* Dock bar */}
        <div class="relative translate-y-1 w-full bg-foreground md:p-2 p-1 rounded-md z-10">
          <ul class="flex md:gap-x-12 gap-x-3">
            {props.children}
          </ul>
        </div>

      </div>
    </DockContext.Provider>
  );
}
