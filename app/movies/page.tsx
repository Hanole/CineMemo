import { MovieCard } from "../components/MovieCard";

type TMDBMovie = {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
};

type TMDBMoviesResponse = {
  results: TMDBMovie[];
};

export default async function Movies() {
  const token = process.env.TMDB_API_KEY;

  if (!token) {
    throw new Error("API missing in .env.local");
  }

  const response = await fetch(
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Could not fetch movies: ${response.status}`);
  }

  const data: TMDBMoviesResponse = await response.json();

  return (
    <>
      <h1>Movies</h1>
      <div className="movie-grid">
        {data.results.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            posterPath={movie.poster_path}
            title={movie.title}
            year={Number(movie.release_date.slice(0, 4))}
          />
        ))}
      </div>
    </>
  );
}
