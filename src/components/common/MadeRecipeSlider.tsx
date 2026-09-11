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
    <SlideToConfirm
      label="Slide when you've made this recipe →"
      icon={<CookingPot color="var(--color-background)" class="size-5" />}
      thumbColor="bg-orange"
      disabledReason={() => (props.pending() ? "Recording..." : null)}
      onConfirm={props.onConfirm}
    />
  );
}
