import { literaryThemes } from "@/data/literaryThemes";

import ThemesArtwork from "../themes-artwork";

type SecondStepProps = {
  selectedMood?: string;
  onSelectedMood: (mood: string) => void;
};
function SecondStep({ selectedMood, onSelectedMood }: SecondStepProps) {
  const handleMoodSelection = (mood: string) => {
    onSelectedMood(mood);
  };

  return (
    <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-3 lg:gap-8">
      {literaryThemes.map((theme) => (
        <ThemesArtwork
          name={theme.name}
          cover={theme.cover}
          selectedMood={selectedMood}
          onClickMoodCard={handleMoodSelection}
          key={theme.name}
        />
      ))}
    </div>
  );
}

export default SecondStep;
