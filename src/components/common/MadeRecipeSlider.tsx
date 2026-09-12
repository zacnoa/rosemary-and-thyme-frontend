import { Accessor } from "solid-js";
import { CookingPot } from "lucide-solid";
import SlideToConfirm from "./SlideToConfirm";

type MadeRecipeSliderProps = {
  pending: Accessor<boolean>;
  onConfirm: () => void;
};

/** Lets a reader deliberately record that they completed the recipe. */
export default function MadeRecipeSlider(props: MadeRecipeSliderProps) {
  return (
    <div class="w-full md:w-3/7 mx-auto">
      <SlideToConfirm
        label="Slide when you've made this recipe →"
        icon={<CookingPot color="var(--color-background)" class="size-5" />}
        thumbColor="bg-orange"
        trackClass="bg-foreground3"
        labelClass="text-background"
        mutedTextClass="text-foreground3"
        disabledReason={() => (props.pending() ? "Recording..." : null)}
        onConfirm={props.onConfirm}
      />
    </div>
  );
}
