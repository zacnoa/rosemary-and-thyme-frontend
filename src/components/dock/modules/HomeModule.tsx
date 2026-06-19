import { House } from "lucide-solid";

export default function HomeButton() {
  return (
    <li class="bg-blue p-1 rounded-md cursor-pointer">
      <House color="var(--color-background)" class="md:w-[30px] h-auto" />
    </li>
  );
}
