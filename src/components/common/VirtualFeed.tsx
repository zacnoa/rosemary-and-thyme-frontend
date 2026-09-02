import { createEffect, For, on, onCleanup, Show, createSignal, type JSX } from "solid-js";
import type { FeedPage } from "~/model/interfaces/FeedPage";

/**
 * Defines the handle used to update items in a mounted feed.
 */
export interface VirtualFeedHandle<T> {
  remove: (id: string) => void;
  patch: (id: string, updater: (item: T) => T) => void;
}

/**
 * Renders a cursor-paginated feed with infinite scrolling.
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

  /**
 * Provides the attachSentinel function.
 */
  const attachSentinel = (el: HTMLDivElement) => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadNext();
    });
    observer.observe(el);
    onCleanup(() => observer.disconnect());
  };

  return (
    <div class={props.class}>
      <div class="flex flex-col gap-12">
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
