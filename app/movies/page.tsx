import Link from "next/link";
import Form from "next/form";
import { Suspense } from "react";
import MovieResults from "../components/MovieResults";
import MovieSkeleton from "../components/MovieSkeleton";

type TMDBGenresResponse = {
  genres: {
    id: number;
    name: string;
  }[];
};

type MoviesProps = {
  searchParams: Promise<{
    query?: string;
    genre?: string;
    page?: string;
  }>;
};

export default async function Movies({ searchParams }: MoviesProps) {
  const token = process.env.TMDB_API_KEY;

  if (!token) {
    throw new Error("API missing in .env.local");
  }

  // les søk og sjanger fra url, til navigasjon
  const params = await searchParams;
  const query = (params.query ?? "").trim();
  const genre = (params.genre ?? "").trim();

  const requestedPage = Number(params.page ?? "1");

  // Bruk et gyldig sidetall mellom 1 og 500.
  const page =
    Number.isInteger(requestedPage) && requestedPage >= 1
      ? Math.min(requestedPage, 500)
      : 1;

  // Hent genre til skjemaets nedtrekksliste.
  const genresResponse = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list?language=en-US",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 300 },
    },
  );

  if (!genresResponse.ok) {
    throw new Error(`Could not fetch genres: ${genresResponse.status}`);
  }

  const genreData: TMDBGenresResponse = await genresResponse.json();

  return (
    <>
      <h1>Movies</h1>
      
      <Form
        action="/movies"
        key={JSON.stringify([query, genre])}
        className="movie-filters"
      >
        <div className="movie-filters_field movie-filters_search">
          <label htmlFor="movie-search">Search movies</label>
          <input
            type="search"
            name="query"
            id="movie-search"
            defaultValue={query}
            placeholder="Enter a movie title..."
          />
        </div>

        <div className="movie-filters_field">
          <label htmlFor="genre-filter">Genre</label>
          <select name="genre" defaultValue={genre} id="genre-filter">
            <option value="">All genres</option>
            {genreData.genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div className="movie-filters_actions">
          <button type="submit">Search</button>

          {(query !== "" || genre !== "") && <Link href="/movies">Reset</Link>}
        </div>
      </Form>

      {query !== "" && <p>Search results for: {query}</p>}

      {/* Skeletons */}
      <Suspense
        key={JSON.stringify([query, genre, page])}
        fallback={<MovieSkeleton />}
      >
        <MovieResults query={query} genre={genre} page={page} />
      </Suspense>
    </>
  );
}
