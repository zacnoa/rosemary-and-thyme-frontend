import { UUID } from "../types/UUID";

/**
 * Defines the RecipeFeed type.
 */
export interface RecipeFeed {
  id: UUID;
  name: string;
  description: string;
  likes: number;
  userName: string;
  createDate: Date;
  heroImageUrl: string | null;
  isPrivate: boolean;
}
