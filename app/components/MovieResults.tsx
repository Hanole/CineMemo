import Link from "next/link";
import { MovieCard } from "./MovieCard";

type MovieResultsProps = {
  query: string;
  genre: string;
  page: number;
};

type TMDBMovie = {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  genre_ids?: number[] | null;
};

type TMDBMoviesResponse = {
  results: TMDBMovie[];
  page: number;
  total_pages: number;
};

export default async function MovieResults({
  query,
  genre,
  page,
}: MovieResultsProps) {


  // Testing av Error ved å skrive inn test-error i søkefeltet på /movies.
    if (query === "test-error") {
    throw new Error("Testing the error page");
  }

  const token = process.env.TMDB_API_KEY;

  if (!token) {
    throw new Error("API missing in .env.local");
  }


  // Kombinert søk hvor man henter tittel før sjanger brukes
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

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Could not fetch movies: ${response.status}`);
  }

  const data: TMDBMoviesResponse = await response.json();

  const pageSize = 20;
  let visibleMovies = data.results;
  let totalPages = Math.min(data.total_pages, 500);
  let currentPage = page;

  if (isCombinedSearch) {
    // samler opptil 250 sider med tittel før filtrering
    const allMovies: TMDBMovie[] = [...data.results];
    const searchPages = Math.min(data.total_pages, 250);
    // sidene hentes i batches, opptil 15 om gangen
    const batchSize = 15;

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

    // filterering av filmer hvor man beholder kun de som har sjangeren
    const filteredMovies = allMovies.filter((movie) =>
      movie.genre_ids?.includes(Number(genre)) ?? false,
    );

    // regner sidetall på nytt etter filtrering
    totalPages = Math.ceil(filteredMovies.length / pageSize);
    currentPage = Math.min(page, Math.max(totalPages, 1));

    // vise kun filmene som tilhører siden
    const startIndex = (currentPage - 1) * pageSize;

    visibleMovies = filteredMovies.slice(startIndex, startIndex + pageSize);
  }

  // holder på søk og sjanger når man bytter side eller kommer fra en film.
  function createPageUrl(targetPage: number) {
    const pageParams = new URLSearchParams();

    if (query !== "") pageParams.set("query", query);
    if (genre !== "") pageParams.set("genre", genre);

    pageParams.set("page", String(targetPage));

    return `/movies?${pageParams.toString()}`;
  }

  return (
    <>
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
              year={movie.release_date ? Number(movie.release_date.slice(0, 4)) : null}
              returnTo={createPageUrl(currentPage)}
            />
          ))}
        </div>
      )}
      {totalPages > 0 && (
        <nav className="pagination-movies">
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
          <span>
            Page {currentPage} of {totalPages}
          </span>
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
  )
}
