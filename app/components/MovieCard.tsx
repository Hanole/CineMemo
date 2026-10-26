import Link from "next/link";

type MovieCardProps = {
  id: number;
  title: string;
  year: number | null;
  posterPath: string | null;
  returnTo: string;
};

export function MovieCard({
  title,
  year,
  id,
  posterPath,
  returnTo,
}: MovieCardProps) {
  return (
    <article className="movie-card">
      {/* sende adressen videre */}
      <Link
        href={{
          pathname: `/movies/${id}`,
          query: { returnTo },
        }}
      >
        <div className="movie-card_poster">
          {posterPath ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${posterPath}`}
              alt={`Poster for ${title}`}
            />
          ) : (
            <span>No poster available</span>
          )}
        </div>

        <div className="movie-card_predetail">
          <h2>{title}</h2>
          <p>{year ?? "Release year unknown"}</p>
        </div>
      </Link>
    </article>
  );
}
