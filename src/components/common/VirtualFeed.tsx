import { createEffect, For, on, onCleanup, Show, createSignal, type JSX } from "solid-js";
import type { FeedPage } from "~/model/interfaces/FeedPage";

/**
 * Imperative handle for mutating a mounted `<VirtualFeed/>`'s items from outside,
 * handed to the caller via `props.ref` (a callback, not a DOM ref - see VirtualFeed's
 * own KDoc). Needed because the fetched pages live in VirtualFeed's own internal
 * signal, not the parent's - a card's delete/unlike/toggle action still needs to
 * drop or patch that one item without a full refetch (same "server already
 * confirmed it" reasoning components/dashboard/RecipeSearch.tsx etc. always used).
 */
export interface VirtualFeedHandle<T> {
  /** Drops the item with this id from the list, e.g. after a confirmed delete/unlike. */
  remove: (id: string) => void;
  /** Replaces the item with this id via `updater(current)`, e.g. after a confirmed privacy toggle. */
  patch: (id: string, updater: (item: T) => T) => void;
}

/**
 * Generic cursor-paginated, infinite-scroll list - the shared shell behind every
 * `/search`-backed feed (`components/home/RecipeSearch.tsx`,
 * `components/dashboard/RecipeSearch.tsx`, `components/dashboard/LikedRecipes.tsx`).
 * Named "virtual" for the infinite-scroll behavior (only as many pages as the
 * visitor has actually scrolled to are ever fetched), not DOM windowing - every
 * fetched item stays mounted, which is deliberately kept simple for this app's
 * scale rather than adding a virtualization library (e.g. `@tanstack/solid-virtual`)
 * up front; card heights here vary too much (description length, hero image count)
 * for that to be a drop-in change anyway, so it's left for if this ever actually
 * becomes a perf problem.
 *
 * Owns the entire fetch lifecycle: the first page loads as soon as this mounts (or
 * [resetKey] changes - see below), and each further page loads when a sentinel
 * element at the bottom of the list scrolls into view (`IntersectionObserver`,
 * which - per spec - accounts for a scrollable ancestor's own clipping, so this
 * works unmodified both for a whole-page feed (home) and one boxed in its own
 * `overflow-y-auto` container (dashboard/liked, via [props.class])).
 *
 * @param fetchPage fetches one page given the previous page's `nextCursor` (or
 * `null` for the first page) - a thin wrapper around the relevant `queries/*`
 * function, with any other filter (e.g. a search query) closed over by the caller
 * @param renderItem renders one fetched item - callers wire an item's own
 * mutation callbacks (delete/unlike/toggle) back into [props.ref]'s handle
 * themselves (see VirtualFeedHandle), not through this
 * @param getId extracts an item's id, used to target [VirtualFeedHandle.remove]/`patch`
 * @param resetKey when this changes (by `!==`), the list clears and refetches from
 * the first page - e.g. a debounced search query, so a stale page from the
 * previous query is never mixed with the new one. Omit for a feed with nothing to
 * reset on (e.g. LikedRecipes, which has no search box) - the first page still
 * loads once on mount either way.
 * @param ref callback handed a [VirtualFeedHandle] once, on mount (a plain
 * function prop, not a DOM ref - there's no single root element this could
 * `bind:this` onto that would make sense as one) - assign it to a local
 * `let handle: VirtualFeedHandle<T> | undefined` and call e.g. `handle?.remove(id)`
 * from an item's own callback
 * @param emptyMessage shown once the first page has loaded and it's empty
 * @param loadingMessage shown while the first page (or a reset's fresh first page)
 * is in flight, replacing the (empty) list - subsequent "load more" fetches show a
 * smaller inline message below the existing items instead, so the list already on
 * screen never disappears just because the next page is loading
 * @param class applied to the scrollable container - pass `max-h-[60vh]
 * overflow-y-auto` (etc.) for a boxed feed, or omit for one that scrolls with the page
 */
export default function VirtualFeed<T>(props: {
  fetchPage: (cursor: string | null) => Promise<FeedPage<T>>;
  renderItem: (item: T) => JSX.Element;
  getId: (item: T) => string;
  resetKey?: unknown;
  ref?: (handle: VirtualFeedHandle<T>) => void;
  emptyMessage?: string;
  loadingMessage?: string;
  class?: string;
}) {
  const [items, setItems] = createSignal<T[]>([]);
  const [cursor, setCursor] = createSignal<string | null>(null);
  const [hasMore, setHasMore] = createSignal(true);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal(false);

  const loadNext = async () => {
    if (loading() || !hasMore()) return;
    setLoading(true);
    setError(false);
    try {
      const page = await props.fetchPage(cursor());
      setItems((prev) => [...prev, ...page.items]);
      setCursor(page.nextCursor);
      setHasMore(page.nextCursor !== null);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  props.ref?.({
    remove: (id) => setItems((prev) => prev.filter((item) => props.getId(item) !== id)),
    patch: (id, updater) =>
      setItems((prev) => prev.map((item) => (props.getId(item) === id ? updater(item) : item))),
  });

  // `on` with its default `defer: false` also fires once immediately on setup, so
  // this doubles as the initial "load the first page" trigger - no separate
  // onMount needed, whether or not the caller passes a resetKey at all.
  createEffect(
    on(
      () => props.resetKey,
      () => {
        setItems([]);
        setCursor(null);
        setHasMore(true);
        setError(false);
        loadNext();
      }
    )
  );

  /** Ref callback (not a signal) - sets up the "load more" observer exactly once, for this element's whole lifetime. */
  const attachSentinel = (el: HTMLDivElement) => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadNext();
    });
    observer.observe(el);
    onCleanup(() => observer.disconnect());
  };

  return (
    <div class={props.class}>
      <div class="flex flex-col gap-3">
        <For each={items()}>{(item) => props.renderItem(item)}</For>
      </div>

      <Show when={loading() && items().length === 0}>
        <p class="text-sm text-foreground3">{props.loadingMessage ?? "Loading..."}</p>
      </Show>

      <Show when={!loading() && !error() && items().length === 0}>
        <p class="text-sm text-foreground3">{props.emptyMessage ?? "Nothing here yet"}</p>
      </Show>

      <Show when={loading() && items().length > 0}>
        <p class="text-sm text-foreground3 mt-3">Loading more...</p>
      </Show>

      <Show when={error() && !loading()}>
        <button
          type="button"
          onClick={loadNext}
          class="text-sm text-red underline mt-3 cursor-pointer"
        >
          Could not load more - tap to retry
        </button>
      </Show>

      {/* 1px, not 0 - a zero-size element can fail to register with IntersectionObserver in some browsers. Sits past the last item/messages above, so it only enters view once there's real room to scroll to it. */}
      <div ref={attachSentinel} class="h-px" aria-hidden="true" />
    </div>
  );
}
