import Image from "next/image";

import { BookVolume } from "@/types/bookInformationResponse";

import { Button } from "../ui/button";
//
type RecommendationsArtworkProps = {
  recommendations: { book: string; author: string }[];
  bookInformation: BookVolume[];
  error: boolean;
};

function RecommendationsArtwork({
  recommendations,
  bookInformation,
  error = true,
}: RecommendationsArtworkProps) {
  return (
    <div>
      {error && (
        <p className="mt-12 text-center text-sm">
          Something went wrong. Please confirm if you introduced the API keys
          correctly and try again. Confirm the instructions{" "}
          <a href="https://github.com/MartaBento/bookish-genie">here</a>.
        </p>
      )}

      {!error && (
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {recommendations.map(({ book, author }, index) => {
            const bookDetail = bookInformation[index];
            const thumbnail = bookDetail?.volumeInfo?.imageLinks?.thumbnail;
            const identifier =
              bookDetail?.volumeInfo?.industryIdentifiers[0]?.identifier ??
              "N/A";

            return (
              <li key={book}>
                <div className="flex flex-col items-center">
                  <Image
                    src={thumbnail}
                    alt={`The cover image of the book ${book} - ${author}`}
                    width={200}
                    height={100}
                    className="h-72 w-auto rounded-lg border-2 object-cover hover:opacity-80 hover:outline-dotted hover:outline-offset-2 hover:outline-teal-500 dark:hover:outline-indigo-950"
                  />
                  <section className="mt-4 text-center">
                    <h3 className="text-lg font-bold">{book}</h3>
                    <p className="text-gray-400">{author}</p>
                  </section>
                  <div className="mt-4 text-center">
                    <Button
                      variant="secondary"
                      className="border-2 hover:outline-dotted hover:outline-offset-2 hover:outline-teal-500 dark:hover:outline-indigo-950"
                      onClick={() =>
                        window.open(
                          `https://www.goodreads.com/search?q=${identifier}`,
                          "_blank"
                        )
                      }
                    >
                      View book details on Goodreads
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default RecommendationsArtwork;
