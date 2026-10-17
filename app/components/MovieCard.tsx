import Link from "next/link";

type MovieCardProps = {
  id: number;
  title: string;
  year: number;
  posterPath: string | null;
};

export function MovieCard({ title, year, id, posterPath }: MovieCardProps) {
  return (
    <article className="movie-card">
      <Link href={`/movies/${id}`}>
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
          <p>{year}</p>
        </div>
      </Link>
    </article>
  );
}
