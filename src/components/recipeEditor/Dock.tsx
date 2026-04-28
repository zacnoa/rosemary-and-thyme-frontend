import { EyeOff, House, Moon, Notebook, Save, Search, User } from "lucide-solid";

export default function Dock() {

  return (
    <div class=" w-full bg-foreground md:p-2 p-1 rounded-md">
      <ul class="flex md:gap-x-12 gap-x-3" >
        <li class="bg-blue p-1 rounded-md"><House color="#302828" class="md:w-[30px] h-auto" /></li>
        <li class="bg-foreground p-1 rounded-md"><Moon color="#282828" class="md:w-[30px] h-auto" /></li>
        <li class="bg-red rounded-md p-1"><EyeOff color="#282828" class="md:w-[30px] h-auto" /></li>
        <li class="bg-orange rounded-md p-1"><Search color="#282828" class="md:w-[30px] h-auto" /></li>
        <li class="bg-purple rounded-md p-1" ><Notebook color="#282828" class="md:w-[30px] h-auto" /></li>
        <li class="bg-green rounded-md p-1"><Save color="#282828" class="md:w-[30px] h-auto" /></li>
        <li class="bg-gray rounded-md p-1"><User color="#282828" class="md:w-[30px] h-auto" /></li>
      </ul>

    </div>

  )
}
