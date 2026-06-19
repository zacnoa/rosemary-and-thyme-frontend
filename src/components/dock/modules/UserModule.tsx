import { User } from "lucide-solid";

export default function UserButton() {
  return (
    <li class="bg-gray rounded-md p-1 cursor-pointer">
      <User color="var(--color-background)" class="md:w-[30px] h-auto" />
    </li>
  );
}
