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
 * Renders nothing - purely a side effect that fires once per login: if the signed-in
 * user has a pending deletion request (see AccountSettings.tsx's persistent dashboard
 * banner, the *other* place this is surfaced), show a one-off toast on whichever page
 * they land on right after signing in, so the warning isn't something they only see
 * if they happen to visit the dashboard.
 *
 * "Once per login": every login (password, Google, or the fresh session a
 * verify-email/password-reset confirm issues) ends in a full page load - see
 * AuthProvider for why useAuth() is a page-level snapshot rather than something that
 * updates in place - so this component remounts fresh each time. [SHOWN_KEY] in
 * `sessionStorage` stops it from re-firing on every subsequent page navigation within
 * that same login, and UserModule.tsx's logout clears the key so the next login (by
 * the same or a different account) isn't suppressed by a stale flag from before.
 *
 * Mounted inside both AuthProvider and NotificationProvider in app.tsx (unlike
 * CookieNotice, which needs neither) - see app.tsx for the exact placement.
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
