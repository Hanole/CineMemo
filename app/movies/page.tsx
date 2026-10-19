import Link from "next/link";
import Form from "next/form";
import { MovieCard } from "../components/MovieCard";

type TMDBMovie = {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  genre_ids: number[];
};

type TMDBMoviesResponse = {
  results: TMDBMovie[];
  page: number;
  total_pages: number;
};

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

  const params = await searchParams;
  const query = (params.query ?? "").trim();
  const genre = (params.genre ?? "").trim();

  const requestedPage = Number(params.page ?? "1");

  const page =
    Number.isInteger(requestedPage) && requestedPage >= 1
      ? Math.min(requestedPage, 500)
      : 1;

  const isCombinedSearch = query !== "" && genre !== "";
  const apiPage = isCombinedSearch ? 1 : page;

  let url: string;
  if (query !== "") {
    url = `https://api.themoviedb.org/3/search/movie?language=en-US&page=${apiPage}&query=${encodeURIComponent(query)}`;
  } else if (genre !== "") {
    url = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${encodeURIComponent(genre)}`;
  } else {
    url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`;
  }
  const genreUrl =
    "https://api.themoviedb.org/3/genre/movie/list?language=en-US";

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 300 },
  });

  const genresResponse = await fetch(genreUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 300 },
  });

  if (!genresResponse.ok) {
    throw new Error(`Could not fetch genres: ${genresResponse.status}`);
  }

  const genreData: TMDBGenresResponse = await genresResponse.json();

  if (!response.ok) {
    throw new Error(`Could not fetch movies: ${response.status}`);
  }

  const data: TMDBMoviesResponse = await response.json();

  const pageSize = 20;
  let visibleMovies = data.results;
  let totalPages = Math.min(data.total_pages, 500);
  let currentPage = page;

  if (isCombinedSearch) {
    const allMovies: TMDBMovie[] = [...data.results];
    const searchPages = Math.min(data.total_pages, 500);
    const batchSize = 5;

    for (let firstPage = 2; firstPage <= searchPages; firstPage += batchSize) {
      const lastPage = Math.min(firstPage + batchSize - 1, searchPages);

      const pageNumbers = Array.from(
        {
          length: lastPage - firstPage + 1,
        },
        (_, index) => firstPage + index,
      );

      const responses = await Promise.all(
        pageNumbers.map(async (pageNumber) => {
          const pageUrl =
            `https://api.themoviedb.org/3/search/movie` +
            `?language=en-US&page=${pageNumber}` +
            `&query=${encodeURIComponent(query)}`;

          const pageResponse = await fetch(pageUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            next: { revalidate: 300 },
          });

          if (!pageResponse.ok) {
            throw new Error(
              `Could not fetch movie page ${pageNumber}: ${pageResponse.status}`,
            );
          }

          const pageData: TMDBMoviesResponse = await pageResponse.json();

          return pageData;
        }),
      );

      for (const pageData of responses) {
        allMovies.push(...pageData.results);
      }
    }

    const filteredMovies = allMovies.filter((movie) =>
      movie.genre_ids.includes(Number(genre)),
    );

    totalPages = Math.ceil(filteredMovies.length / pageSize);
    currentPage = Math.min(page, Math.max(totalPages, 1));

    const startIndex = (currentPage - 1) * pageSize;

    visibleMovies = filteredMovies.slice(startIndex, startIndex + pageSize);
  }

  function createPageUrl(targetPage: number) {
    const pageParams = new URLSearchParams();

    if (query !== "") pageParams.set("query", query);
    if (genre !== "") pageParams.set("genre", genre);

    pageParams.set("page", String(targetPage));

    return `/movies?${pageParams.toString()}`;
  }

  return (
    <>
      <h1>Movies</h1>
      <Form action="/movies" key={JSON.stringify([query, genre])}>
        <label htmlFor="movie-search">Search movies</label>
        <input
          type="search"
          name="query"
          id="movie-search"
          defaultValue={query}
        />

        <label htmlFor="genre-filter">Genre</label>
        <select name="genre" defaultValue={genre} id="genre-filter">
          <option value="">All genres</option>
          {genreData.genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        <button type="submit">Search</button>
        {(query !== "" || genre !== "") && <Link href="/movies">Reset</Link>}
      </Form>

      {query !== "" && <p>Search results for: {query}</p>}
      {visibleMovies.length === 0 ? (
        <p>No movies found</p>
      ) : (
        <div className="movie-grid">
          {visibleMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              posterPath={movie.poster_path}
              title={movie.title}
              year={Number(movie.release_date.slice(0, 4))}
            />
          ))}
        </div>
      )}
      {totalPages > 0 && (
        <nav>
          {currentPage > 1 ? (
            <Link href={createPageUrl(1)}>First page</Link>
          ) : (
            <span aria-disabled="true">First page</span>
          )}
          {currentPage > 1 ? (
            <Link href={createPageUrl(currentPage - 1)}>Previous</Link>
          ) : (
            <span aria-disabled="true">Previous page</span>
          )}
          <p>
            Page {currentPage} of {totalPages}
          </p>
          {currentPage < totalPages ? (
            <Link href={createPageUrl(currentPage + 1)}>Next</Link>
          ) : (
            <span aria-disabled="true">Next</span>
          )}
          {currentPage < totalPages ? (
            <Link href={createPageUrl(totalPages)}>Last page</Link>
          ) : (
            <span aria-disabled="true">Last page</span>
          )}
        </nav>
      )}
    </>
  );
}
