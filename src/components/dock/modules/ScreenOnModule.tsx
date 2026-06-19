import { EyeOff } from "lucide-solid";

export default function EyeOffButton() {
  return (
    <li class="bg-red rounded-md p-1 cursor-pointer">
      <EyeOff color="var(--color-background)" class="md:w-[30px] h-auto" />
    </li>
  );
}
