export enum ISBNType {
  ISBN_13 = "ISBN_13",
  ISBN_10 = "ISBN_10",
}

interface IndustryIdentifier {
  type: ISBNType;
  identifier: string;
}

export interface BookVolume {
  volumeInfo: {
    imageLinks: {
      thumbnail: string;
    };
    industryIdentifiers: IndustryIdentifier[];
  };
}
