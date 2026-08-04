import { LogIn, LogOut, User, UserPlus } from "lucide-solid";
import { A } from "@solidjs/router";
import { onMount } from "solid-js";
import { useDock } from "../context/DockContext";
import { useAuth } from "~/components/auth/context/useAuth";

const PANEL_ID = "user";

export default function UserButton() {
  const { toggle, activePanel, registerPanel } = useDock();
  const user = useAuth();

  const logout = async () => {
    await fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/";
  };

  onMount(() => {
    registerPanel(PANEL_ID, () =>
      user ? (
        <div class="flex flex-col gap-3 text-background">
          <div class="border-b-2 border-background pb-2">
            <p class="text-base md:text-lg font-bold">{user.username}</p>
            <p class="text-xs md:text-sm opacity-80">{user.email}</p>
          </div>
          <button
            class="flex items-center gap-2 self-start px-3 py-1 rounded-md bg-linear-to-r from-red to-orange cursor-pointer"
            onClick={logout}
          >
            <LogOut class="size-5" />
            Log out
          </button>
        </div>
      ) : (
        <ul class="flex flex-col gap-3 text-background list-none">
          <li>
            <A href="/auth/login" class="flex items-center gap-2">
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
