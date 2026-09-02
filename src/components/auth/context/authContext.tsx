
import { createContext } from "solid-js";
import { UUID } from "~/model/types/UUID";

/**
 * Defines the User type.
 */
export type User = {
  username: string,
  id: UUID,
  email: string,
  // ISO 8601 timestamp, or null unless the account is scheduled for deletion -
  // see components/dashboard/AccountSettings.tsx and
  // components/common/AccountDeletionNotice.tsx, the two readers.
  deletionRequestedAt: string | null,
  // false only for a Google-only account with no password set at all - see
  // components/dashboard/AccountSettings.tsx, the only reader.
  hasPassword: boolean
}

/**
 * Provides the AuthContext function.
 */
export const AuthContext = createContext<User | null>();
