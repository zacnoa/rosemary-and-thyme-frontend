import { createMemo, createSignal, Show } from "solid-js";
import { Trash2 } from "lucide-solid";
import SlideToConfirm from "~/components/common/SlideToConfirm";
import { useNotification } from "~/components/notification/context/useNotification";
import { changePassword } from "~/queries/changePassword";
import { requestAccountDeletion } from "~/queries/requestAccountDeletion";
import { cancelAccountDeletion } from "~/queries/cancelAccountDeletion";
import { daysUntilAccountDeletion } from "~/utils/accountDeletion";
import type { User } from "~/components/auth/context/authContext";

// How long the success toast stays visible before the reload swaps the page out from
// under it - shorter than NotificationProvider's own 4s auto-dismiss, just long enough
// to actually be read.
const RELOAD_DELAY_MS = 1200;

/**
 * Provides the AccountSettings function.
 */
export default function AccountSettings(props: { user: User }) {
  return (
    <section class="flex flex-col gap-8 mt-10 pt-8 border-t-2 border-foreground2">
      <h2 class="text-xl md:text-2xl font-bold">Account settings</h2>
      <ChangePasswordForm hasPassword={props.user.hasPassword} />
      <DeleteAccountControl deletionRequestedAt={props.user.deletionRequestedAt} />
    </section>
  );
}

function ChangePasswordForm(props: { hasPassword: boolean }) {
  const { notify } = useNotification();
  const [currentPassword, setCurrentPassword] = createSignal("");
  const [newPassword, setNewPassword] = createSignal("");
  const [pending, setPending] = createSignal(false);

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    setPending(true);

    // try/finally - a network failure or non-JSON error body rejects the
    // promise rather than returning a value; without this the button would
    // stay stuck on "Changing..." forever with no indication anything went wrong.
    try {
      const { ok, status, json } = await changePassword(currentPassword(), newPassword());

      if (!ok) {
        // 422 = Google-only account, no password to change - see GoogleAccountException
        // on the backend and queries/changePassword.ts. Shouldn't actually be reachable
        // here since the form is hidden for that case (see the `!hasPassword` branch
        // below), but kept as a defensive fallback in case that ever drifts out of sync.
        const message =
          status === 422
            ? "This account signs in with Google and has no password to change."
            : (json?.detail ?? "Could not change password");
        notify("error", message);
        return;
      }

      notify("success", "Password changed");
      // The backend rotated the session cookie (every other session was revoked) -
      // a full reload is needed to keep this tab's session in sync going forward,
      // same reasoning as login.tsx's own post-login redirect. Delayed slightly so
      // the success toast above is actually visible before the page swaps out.
      setTimeout(() => window.location.reload(), RELOAD_DELAY_MS);
    } catch {
      notify("error", "Could not reach the server - check your connection and try again");
    } finally {
      setPending(false);
    }
  };

  if (!props.hasPassword) {
    return (
      <div class="flex flex-col gap-2 max-w-sm">
        <h3 class="text-lg md:text-xl font-bold">Change password</h3>
        <p class="text-sm text-foreground3">
          This account signs in with Google and has no password to change.
        </p>
      </div>
    );
  }

  return (
    <form class="flex flex-col gap-4 max-w-sm" onSubmit={submit}>
      <h3 class="text-lg md:text-xl font-bold">Change password</h3>
      <div class="flex flex-col gap-1">
        <label for="current-password" class="text-sm md:text-base text-foreground3">Current password</label>
        <input
          id="current-password"
          type="password"
          autocomplete="current-password"
          required
          class="outline-none bg-transparent border-b-2 border-foreground3 focus:border-orange py-1 text-base md:text-lg"
          value={currentPassword()}
          onInput={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div class="flex flex-col gap-1">
        <label for="new-password" class="text-sm md:text-base text-foreground3">New password</label>
        <input
          id="new-password"
          type="password"
          autocomplete="new-password"
          required
          class="outline-none bg-transparent border-b-2 border-foreground3 focus:border-orange py-1 text-base md:text-lg"
          value={newPassword()}
          onInput={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={pending()}
        class="self-start px-4 py-2 rounded-md bg-linear-to-r from-green to-orange cursor-pointer font-bold disabled:opacity-50"
      >
        {pending() ? "Changing..." : "Change password"}
      </button>
    </form>
  );
}

function DeleteAccountControl(props: { deletionRequestedAt: string | null }) {
  const { notify } = useNotification();
  const [cancelling, setCancelling] = createSignal(false);
  const [deleting, setDeleting] = createSignal(false);

  const daysLeft = createMemo(() =>
    props.deletionRequestedAt ? daysUntilAccountDeletion(props.deletionRequestedAt) : null
  );

  const cancel = async () => {
    setCancelling(true);
    try {
      const { ok, json } = await cancelAccountDeletion();
      if (!ok) {
        notify("error", json?.detail ?? "Could not cancel deletion");
        return;
      }
      window.location.reload();
    } catch {
      notify("error", "Could not reach the server - check your connection and try again");
    } finally {
      setCancelling(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const { ok, json } = await requestAccountDeletion();
      if (!ok) {
        notify("error", json?.detail ?? "Could not delete account");
        return;
      }
      window.location.reload();
    } catch {
      notify("error", "Could not reach the server - check your connection and try again");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div class="flex flex-col gap-4 max-w-sm">
      <h3 class="text-lg md:text-xl font-bold">Delete account</h3>

      <Show
        when={daysLeft() !== null}
        fallback={
          <>
            <p class="text-sm text-foreground3">
              This permanently deletes your account and every recipe you've posted, 30 days after you confirm below.
              You can cancel any time before then.
            </p>
            {/*
              trackClass/labelClass/mutedTextClass overridden same as
              DashboardRecipeCard.tsx's own SlideToConfirm - this section sits
              directly on the dashboard page's bg-background, where the
              default bg-background track would otherwise blend straight in.
            */}
            <SlideToConfirm
              label="Slide to delete account →"
              icon={<Trash2 color="var(--color-background)" class="size-5" />}
              thumbColor="bg-red"
              trackClass="bg-foreground3"
              labelClass="text-background"
              mutedTextClass="text-foreground3"
              disabledReason={() => (deleting() ? "Deleting..." : null)}
              onConfirm={confirmDelete}
            />
          </>
        }
      >
        <p class="text-sm text-red">
          Your account will be permanently deleted in {daysLeft()} day{daysLeft() === 1 ? "" : "s"}.
        </p>
        <button
          type="button"
          disabled={cancelling()}
          onClick={cancel}
          class="self-start px-4 py-2 rounded-md border-2 border-foreground3 font-bold cursor-pointer disabled:opacity-50"
        >
          {cancelling() ? "Cancelling..." : "Cancel deletion"}
        </button>
      </Show>
    </div>
  );
}
