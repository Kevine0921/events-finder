import { INTERNAL_API_MAPPING } from "@/constants/apiMapping";
import {
  BOOK_REC_KEY,
  RECOMMENDATIONS_KEY,
} from "@/constants/localStorageKeys";
import { parseRecommendations } from "@/utils/parseRecommendations";
import axios from "axios";
import { create } from "zustand";

import { BookVolume } from "@/types/bookInformationResponse";
import { ChatChoice } from "@/types/bookRecommendationResponse";
//
interface APIRequestsState {
  isLoading: boolean;
  recommendationsError: string;
  bookInformationError: string;
  recommendations: ChatChoice[];
  bookInformation: BookVolume[];
  hasRecommendations: boolean;
  hasBookInformation: boolean;
  setLoading: (isLoading: boolean) => void;
  setRecommendationsError: (recommendationsError: string) => void;
  setBookInformationError: (bookInformationError: string) => void;
  setBookInformation: (bookInformation: BookVolume[]) => void;
  setRecommendations: (recommendations: ChatChoice[]) => void;
  fetchRecommendations: (
    favoriteGenre: string,
    selectedMood: string,
    bookLengthPreference: string
  ) => Promise<void>;
  fetchBookInformation: () => Promise<void>;
}

const useAPIRequestsState = create<APIRequestsState>((set, get) => ({
  isLoading: false,
  recommendationsError: "",
  bookInformationError: "",
  recommendations: [],
  bookInformation: [],
  hasRecommendations: false,
  hasBookInformation: false,
  setLoading: (loading) => set({ isLoading: loading }),
  setRecommendationsError: (recommendationsError) =>
    set({ recommendationsError }),
  setBookInformationError: (bookInformationError) =>
    set({ bookInformationError }),
  setBookInformation: (bookInformation) => set({ bookInformation }),
  setRecommendations: (recommendations) => set({ recommendations }),
  fetchRecommendations: async (
    favoriteGenre: string,
    selectedMood: string,
    bookLengthPreference: string
  ) => {
    try {
      set({ isLoading: true });

      const storedRecommendations = localStorage.getItem(RECOMMENDATIONS_KEY);
      if (storedRecommendations) {
        set({ recommendations: JSON.parse(storedRecommendations) });
        set({ hasRecommendations: true });
      } else {
        const requestBody = {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a book recommendation AI." },
            {
              role: "user",
              content: `Give me three book recommendations. My favorite genre is ${favoriteGenre}, and I'm searching for something ${selectedMood}. I prefer ${bookLengthPreference} books. Only give me the book title and the author.`,
            },
          ],
        };

        const response = await axios.post(
          INTERNAL_API_MAPPING.postRecommendations,
          requestBody
        );

        if (!response.data) {
          throw new Error("Failed to fetch recommendations.");
        }

        const data = await response.data;

        set({ recommendations: data.choices });
        localStorage.setItem(RECOMMENDATIONS_KEY, JSON.stringify(data.choices));
        set({ hasRecommendations: true });
      }

      set({ isLoading: false, recommendationsError: "" });
    } catch (error: Error | unknown) {
      set({
        isLoading: false,
        recommendationsError:
          error instanceof Error ? error.message : String(error),
        recommendations: [],
        hasRecommendations: false,
      });
    }
  },
  fetchBookInformation: async () => {
    try {
      set({ isLoading: true });

      const { recommendations } = get();

      const parsedRecommendations = parseRecommendations(recommendations);

      const bookPromises = parsedRecommendations.map(async (recommendation) => {
        const { book, author } = recommendation;

        const url = `${INTERNAL_API_MAPPING.getBookDetails}?book=${book}&author=${author}`;

        const response = await axios.get(url);

        if (!response.data) {
          throw new Error(`Failed to fetch book information for ${book}.`);
        }

        const data = await response.data;

        const { items } = data;

        if (!items || items.length === 0) {
          throw new Error(`No book information found for ${book}.`);
        }

        const bookInfo = items[0].volumeInfo;

        const bookVolume = {
          volumeInfo: {
            imageLinks: {
              thumbnail: bookInfo.imageLinks?.thumbnail || "",
            },
            industryIdentifiers: bookInfo.industryIdentifiers || [],
          },
        };

        return bookVolume;
      });

      const updatedBookInformation = await Promise.all(bookPromises);

      set({
        isLoading: false,
        bookInformationError: "",
        bookInformation: updatedBookInformation,
        hasBookInformation: true,
      });

      const storedBookInformation = localStorage.getItem(BOOK_REC_KEY);
      if (!storedBookInformation) {
        localStorage.setItem(
          BOOK_REC_KEY,
          JSON.stringify(updatedBookInformation)
        );
      }
    } catch (error: Error | unknown) {
      set({
        isLoading: false,
        bookInformationError:
          error instanceof Error ? error.message : String(error),
        bookInformation: [] as BookVolume[],
        hasBookInformation: false,
      });
    }
  },
}));

export default useAPIRequestsState;
