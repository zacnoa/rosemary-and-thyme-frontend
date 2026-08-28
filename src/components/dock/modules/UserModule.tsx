import { LayoutDashboard, LogIn, LogOut, Shield, User, UserPlus } from "lucide-solid";
import { A, useLocation } from "@solidjs/router";
import { onMount } from "solid-js";
import { useDock } from "../context/DockContext";
import { useAuth } from "~/components/auth/context/useAuth";
import { ACCOUNT_DELETION_NOTICE_SHOWN_KEY } from "~/components/common/AccountDeletionNotice";
import { logoutUser } from "~/queries/logoutUser";
import { loginHref } from "~/utils/loginRedirect";

const PANEL_ID = "user";

/**
 * Panel showing either the signed-in user's profile + logout, or
 * login/register links for a signed-out visitor - `user` is a one-time
 * snapshot from useAuth(), so this doesn't need to react to auth state
 * changing (see AuthProvider for why: login/logout both force a full page
 * reload rather than updating anything in place).
 */
export default function UserButton() {
  const { toggle, activePanel, registerPanel } = useDock();
  const user = useAuth();
  const location = useLocation();

  /** Clears the session server-side, then hard-reloads to `/` so the next page load resolves queries/getUser.ts fresh (see AuthProvider). */
  const logout = async () => {
    await logoutUser();
    // Clears AccountDeletionNotice's "already shown this login" flag, so a fresh
    // login afterward (same account or a different one, in the same tab) isn't
    // suppressed by a flag left over from before this logout.
    try {
      sessionStorage.removeItem(ACCOUNT_DELETION_NOTICE_SHOWN_KEY);
    } catch {
      // sessionStorage unavailable - nothing to clean up, logout still proceeds
    }
    window.location.href = "/";
  };

  onMount(() => {
    registerPanel(PANEL_ID, () =>
      user ? (
        <div class="flex flex-col gap-3 text-background">
          <div class="border-b-2 border-background pb-2">
            <p class="text-fluid-base-lg font-bold">{user.username}</p>
            <p class="text-fluid-xs-sm opacity-80">{user.email}</p>
          </div>
          <A href="/dashboard" class="flex items-center gap-2 self-start px-3 py-1 rounded-md bg-linear-to-r from-green to-blue cursor-pointer">
            <LayoutDashboard class="size-5" />
            Dashboard
          </A>
          <button
            class="flex items-center gap-2 self-start px-3 py-1 rounded-md bg-linear-to-r from-red to-orange cursor-pointer"
            onClick={logout}
          >
            <LogOut class="size-5" />
            Log out
          </button>
          <A href="/privacy" class="flex items-center gap-2 text-fluid-xs-sm opacity-80 border-t-2 border-background pt-2">
            <Shield class="size-4" />
            Privacy Policy
          </A>
        </div>
      ) : (
        <ul class="flex flex-col gap-3 text-background list-none">
          <li>
            <A href={loginHref(location.pathname)} class="flex items-center gap-2">
              <LogIn class="size-5" />
              Login
            </A>
          </li>
          <li>
            <A href="/auth/register" class="flex items-center gap-2">
              <UserPlus class="size-5" />
              Register
            </A>
          </li>
          <li class="border-t-2 border-background pt-2">
            <A href="/privacy" class="flex items-center gap-2 text-fluid-xs-sm opacity-80">
              <Shield class="size-4" />
              Privacy Policy
            </A>
          </li>
        </ul>
      )
    );
  });

  return (
    <li
      class={`rounded-md p-1 cursor-pointer ${activePanel() === PANEL_ID ? "bg-blue" : "bg-gray"
        }`}
      onClick={() => toggle(PANEL_ID)}
    >
      <User color="var(--color-background)" class="md:w-[30px] h-auto" />
    </li>
  );
}
