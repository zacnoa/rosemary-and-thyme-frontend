import { onMount } from "solid-js";
import { useAuth } from "~/components/auth/context/useAuth";
import { useNotification } from "~/components/notification/context/useNotification";
import { daysUntilAccountDeletion } from "~/utils/accountDeletion";

// Session-scoped (not persisted to localStorage) - cleared on logout (see
// UserModule.tsx, which imports this) so a fresh login, including into a *different*
// account within the same tab, shows the toast again rather than staying suppressed
// forever.
export const ACCOUNT_DELETION_NOTICE_SHOWN_KEY = "account_deletion_notice_shown";

/**
 * Provides the AccountDeletionNotice function.
 */
export default function AccountDeletionNotice() {
  const user = useAuth();
  const { notify } = useNotification();

  onMount(() => {
    if (!user?.deletionRequestedAt) return;

    let alreadyShown = true;
    try {
      alreadyShown = sessionStorage.getItem(ACCOUNT_DELETION_NOTICE_SHOWN_KEY) === "1";
    } catch {
      // sessionStorage unavailable (private mode, blocked site data) - fall back to
      // showing the toast every page load rather than never showing it at all
      alreadyShown = false;
    }
    if (alreadyShown) return;

    const days = daysUntilAccountDeletion(user.deletionRequestedAt);
    notify(
      "error",
      `Your account will be deleted in ${days} day${days === 1 ? "" : "s"}. Cancel anytime from your dashboard.`
    );

    try {
      sessionStorage.setItem(ACCOUNT_DELETION_NOTICE_SHOWN_KEY, "1");
    } catch {
      // best-effort only - see readDismissed-style guards elsewhere (e.g. CookieNotice)
    }
  });

  return null;
}
