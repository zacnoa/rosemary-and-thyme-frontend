import { createSignal, createMemo, JSX, ParentProps, Show } from "solid-js";
import { DockContext } from "./context/DockContext";

/**
 * Must match the `duration-300` transform transition below: content is kept
 * mounted (and the panel kept at its open height) for the full slide-down
 * duration, so it collapses only once it's already off-screen instead of
 * mid-slide.
 */
const CLOSE_ANIMATION_MS = 300;

/**
 * Bottom action bar + slide-down panel shell, shared by every page (see
 * HomeDock/BlogDock/EditorDock, which each just fill in a different set of
 * module `<li>`s as `props.children`). Panel *content* is owned by the
 * individual module components (IngredientsModule, SearchModule, ...) via
 * [registerPanel]; Dock itself only knows "which panel id is open" and how
 * to animate that, not what any panel actually renders.
 *
 * @param props.children the module `<li>` buttons for this page's dock bar
 */
export default function Dock(props: ParentProps) {
  const [activePanel, setActivePanel] = createSignal<string | null>(null);
  const [renderedPanel, setRenderedPanel] = createSignal<string | null>(null);
  const [panels, setPanels] = createSignal<Record<string, () => JSX.Element>>({});
  let closeTimeout: ReturnType<typeof setTimeout> | undefined;

  /**
   * Opens `id`'s panel, or closes it if it's already the open one.
   *
   * `activePanel` (drives the animation) and `renderedPanel` (drives what's
   * actually mounted in the DOM) are deliberately two separate signals with
   * two different lifetimes: opening sets both immediately, but closing only
   * clears `activePanel` right away - `renderedPanel` (and so the panel's
   * content/DOM) is kept alive for [CLOSE_ANIMATION_MS] more so the
   * slide-down transition has something to animate, then torn down once it's
   * already off-screen. Reopening (or switching straight to a different panel)
   * cancels that pending teardown via `closeTimeout`.
   *
   * @param id the panel id to open/close (see [registerPanel])
   */
  const toggle = (id: string) => {
    clearTimeout(closeTimeout);

    if (activePanel() === id) {
      setActivePanel(null);
      closeTimeout = setTimeout(() => setRenderedPanel(null), CLOSE_ANIMATION_MS);
    } else {
      setRenderedPanel(id);
      setActivePanel(id);
    }
  };

  /**
   * Registers what a panel renders, keyed by id. Content is stored as a
   * function (not JSX directly) so it's only actually evaluated when the
   * panel is opened (via [activeContent]) - modules call this once from
   * `onMount`, regardless of whether their panel is ever opened at all.
   *
   * @param id a unique panel id, also passed to [toggle] by whatever button
   * should open this panel (each module picks its own, e.g. `"search"`)
   * @param content renders the panel's body; re-invoked fresh each time the
   * panel transitions from closed to open (see [activeContent])
   */
  const registerPanel = (id: string, content: () => JSX.Element) => {
    setPanels((prev) => ({ ...prev, [id]: content }));
  };

  /**
   * The currently mounted panel's rendered content, or `null` when none is
   * mounted. A memo (not a plain derived call) so `panels()[id]?.()` only
   * actually runs when `renderedPanel`/`panels` change - i.e. once per
   * open, not on every unrelated reactive update - which matters since that
   * call is what freshly evaluates a panel's `content` function.
   */
  const activeContent = createMemo(() => {
    const id = renderedPanel();
    if (!id) return null;
    return panels()[id]?.() ?? null;
  });

  /**
   * Because DockContext is not reliant on any external calls for its state we forego a separate DockProvider.ts file
   */
  return (
    <DockContext.Provider value={{ activePanel, toggle, registerPanel, panels }}>
      <div class="relative w-full">

        {/*
          MASK. Positions a clip window directly above the dock bar, sized to
          whatever the currently rendered panel's height is (no h-* class here,
          so it just wraps its child). overflow-hidden clips anything that
          gets translated outside those bounds - no scrollbar, just a hard cut,
          which is what lets the closed panel disappear instead of leaking
          out below the dock bar. pointer-events-none so this empty region
          doesn't block clicks on the page underneath when no panel is open.
        */}
        <div class="pointer-events-none absolute bottom-full w-full overflow-hidden translate-y-2">
          {/*
            ANIMATION LAYER. transform never affects layout/sizing (only the
            mask div above and the content div below do), so translating this
            div doesn't change the mask's size - it only moves this box
            in/out of the mask's fixed window. translate-y-full shifts it
            down by exactly its own height, i.e. exactly one mask-window's
            worth, so it lands fully outside the clip region. transition-transform
            animates that move over 300ms (CLOSE_ANIMATION_MS above must match).
          */}
          <div
            class={`w-full transition-transform duration-300 ${activePanel() !== null
              ? "translate-y-0 pointer-events-auto"
              : "translate-y-full"
              }`}
          >
            {/*
              CONTENT BOX. The actual visible panel - color, rounded corners,
              padding. min-h-24 keeps small panels (e.g. just a search input)
              from looking cramped; max-h-[60vh] + overflow-y-auto caps and
              scrolls long content (e.g. many search results) instead of
              growing unbounded. Its height is what the mask div above copies,
              so it must stay constant for the full 300ms while closing -
              see renderedPanel/closeTimeout in toggle().
            */}
            <div class="bg-foreground3 rounded-t-2xl p-3 pb-4 w-full min-h-24 max-h-[60vh] overflow-y-auto">
              <Show when={activeContent()}>
                {activeContent()}
              </Show>
            </div>
          </div>
        </div>

        {/*
          Dock bar. gap-x-1 on mobile is deliberately tight - EditorDock
          alone renders 8 module `<li>`s, and justify-between only
          distributes *leftover* space between them (it doesn't shrink
          them), so a wider gap here overflows the narrow w-[92vw] wrapper
          these docks are rendered in on small screens instead of wrapping.
        */}
        <div class="relative translate-y-1 w-full bg-foreground md:p-2 p-1 rounded-md z-10">
          <ul class="flex justify-between md:justify-start gap-x-1 md:gap-x-12">
            {props.children}
          </ul>
        </div>

      </div>
    </DockContext.Provider>
  );
}
