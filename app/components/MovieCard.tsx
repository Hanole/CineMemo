import Link from "next/link";

type MovieCardProps = {
  id: number;
  title: string;
  year: number;
};

export function MovieCard({ title, year, id }: MovieCardProps) {
  return (
    <article className="movie-card">
      <Link href={`/movies/${id}`}>
        <p className="movie-card_poster">Poster</p>

        <div className="movie-card_predetail">
          <h2>{title}</h2>
          <p>{year}</p>
        </div>
      </Link>
    </article>
  );
}
