import Link from "next/link";
import { notFound } from "next/navigation";

type MovieDetailsProps = {
  params: Promise<{ id: string }>;
};

type TMDBMovieDetails = {
  id: number;
  title: string;
  release_date: string;
  runtime: number | null;
  overview: string;
  genres: {
    id: number;
    name: string;
  }[];
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
    }[];
  };
  poster_path: string | null;
};

export default async function MovieDetails({ params }: MovieDetailsProps) {
  const { id } = await params;

  const token = process.env.TMDB_API_KEY;

  if (!token) {
    throw new Error("API missing in .env.local");
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?language=en-US&append_to_response=credits`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(`Could not fetch movies: ${response.status}`);
  }

  const movie: TMDBMovieDetails = await response.json();

  const directors = movie.credits.crew
    .filter((person) => person.job === "Director")
    .map((person) => person.name)
    .join(", ");

  const topCast = movie.credits.cast.slice(0, 6);
  return (
    <>
      <Link href="/movies/">Go back to movies</Link>
      <div className="movie-details">
        <div className="movie-details_poster">
          {movie.poster_path ? (
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`Poster for ${movie.title}`} />
        ) : (
          <span>No poster available</span>
        )}
        </div>
        <section className="movie-details_info">
          <h1>{movie.title}</h1>
          <p>Directed by {directors || "Unknown"}</p>
          <div className="movie-details_meta">
            <p>{movie.release_date.slice(0, 4) || "Release date unknown"}</p>
            <p>{movie.runtime ? `${movie.runtime} min` : "Runtime unknown"}</p>
            <p>{movie.genres.map((genre) => genre.name).join(", ")}</p>
          </div>
          <div>
            <h2>Description</h2>
            <p>{movie.overview || "No description"}</p>
          </div>
          <div>
            <h2>Top Billed Cast</h2>
            <p>
              {topCast
                .map((person) =>
                  person.character
                    ? `${person.name} as ${person.character}`
                    : person.name,
                )
                .join(", ") || "No cast available"}
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
