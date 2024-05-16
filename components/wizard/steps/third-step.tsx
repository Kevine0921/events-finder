import { bookSizing } from "@/data/bookSizing";

import BookSizes from "../book-sizes";

type ThirdStepProps = {
  selectedBookLength?: string;
  onSelectedLength: (length: string) => void;
};
function SecondStep({ selectedBookLength, onSelectedLength }: ThirdStepProps) {
  const handleMoodSelection = (length: string) => {
    onSelectedLength(length);
  };

  return (
    <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-3 lg:gap-8">
      {bookSizing.map((theme) => (
        <BookSizes
          description={theme.description}
          cover={theme.cover}
          selectedLength={selectedBookLength}
          onClickBookLength={handleMoodSelection}
          key={theme.description}
        />
      ))}
    </div>
  );
}

export default SecondStep;
