/**
 * One page of a cursor-paginated feed - the wire shape backend's
 * `RecipeFeedPage` (see `RecipeRepository.selectRecipeFeed`/`selectLikedRecipeFeed`
 * on the backend for why this is cursor- rather than offset-paginated) serializes
 * to, generic over whatever item type a given feed returns. Consumed by
 * `components/common/VirtualFeed.tsx` - see that component for how [nextCursor] is
 * used (echoed straight back as the next page's `?cursor=`, never inspected).
 */
export interface FeedPage<T> {
  items: T[];
  nextCursor: string | null;
}
