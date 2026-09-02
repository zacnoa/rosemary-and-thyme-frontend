/**
 * Defines the FeedPage type.
 */
export interface FeedPage<T> {
  items: T[];
  nextCursor: string | null;
}
