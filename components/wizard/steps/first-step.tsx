import { literaryGenres } from "@/data/literaryGenres";

import GenreArtwork from "../genre-artwork";

type FirstStepProps = {
  favoriteGenre?: string;
  onSelectGenre: (genre: string) => void;
};

function FirstStep({ favoriteGenre, onSelectGenre }: FirstStepProps) {
  const handleGenreSelect = (genre: string) => {
    onSelectGenre(genre);
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
      {literaryGenres.map((genre) => (
        <GenreArtwork
          name={genre.name}
          description={genre.description}
          cover={genre.cover}
          onClickGenreCard={handleGenreSelect}
          selectedGenre={favoriteGenre}
          key={genre.name}
        />
      ))}
    </div>
  );
}

export default FirstStep;
