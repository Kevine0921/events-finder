import { ChatChoice } from "@/types/bookRecommendationResponse";

export function parseRecommendations(
  choices: ChatChoice[]
): { book: string; author: string }[] {
  const recommendations: { book: string; author: string }[] = [];

  choices.forEach((choice) => {
    const content = choice.message.content;

    // Remove leading and trailing whitespace
    const trimmedContent = content.trim();

    // Split the content by newline characters and remove empty elements
    const lines = trimmedContent
      .split("\n")
      .filter((line) => line.trim() !== "");

    // Iterate over the lines and extract book name and author
    lines.forEach((line) => {
      const match = line.match(/(\d+)\.\s+["']([^"']+)["']\s+by\s+([^"']+)/);

      if (match) {
        const [, index, bookName, author] = match;
        recommendations.push({ book: bookName, author });
      }
    });
  });

  return recommendations;
}
