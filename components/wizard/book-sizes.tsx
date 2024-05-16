import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

type BookSizesProps = {
  description: string;
  cover: string;
  selectedLength?: string;
  onClickBookLength: (length: string) => void;
};

function BookSizes({
  description,
  cover,
  selectedLength,
  onClickBookLength,
}: BookSizesProps) {
  const handleSelectBookLength = () => {
    if (selectedLength === description) {
      onClickBookLength("");
    } else {
      onClickBookLength(description);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelectBookLength();
    }
  };

  return (
    <div
      className="group relative block border-2 bg-black hover:cursor-pointer hover:outline-dotted hover:outline-offset-2 hover:outline-teal-500 dark:hover:outline-indigo-950"
      onClick={handleSelectBookLength}
      onKeyDown={(event) => handleKeyDown(event)}
      role="button"
      tabIndex={0}
    >
      <Image
        src={`/bookSizes/${cover}`}
        alt={`An image to illustrate the length ${description}`}
        width={200}
        height={100}
        className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
      />

      <div className="relative p-4 sm:p-6 lg:p-8">
        <h4 className="text-lg font-bold text-white sm:text-2xl">
          {description}
        </h4>
        <div className="mt-32 sm:mt-48 lg:mt-64">
          <div className="translate-y-8 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"></div>
        </div>
      </div>

      {selectedLength === description && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-teal-500/90 text-white dark:bg-indigo-950/90">
          <CheckCircle2 size={40} color="white" />
          <p className="mt-2 text-sm font-semibold">Length selected!</p>
        </div>
      )}
    </div>
  );
}

export default BookSizes;
