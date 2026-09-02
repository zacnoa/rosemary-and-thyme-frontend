import { House } from "lucide-solid";
import { A } from "@solidjs/router";

/**
 * Provides the HomeButton function.
 */
export default function HomeButton() {
  return (
    <li class="bg-blue rounded-md">
      <A href="/" class="flex p-1 cursor-pointer">
        <House color="var(--color-background)" class="md:w-[30px] h-auto" />
      </A>
    </li>
  );
}
