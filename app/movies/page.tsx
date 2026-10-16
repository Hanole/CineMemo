import { MovieCard } from "../components/MovieCard";
import { movieDetails } from "../data/movies";

export default function Movies() {

  return (
    <>
      <h1>Movies</h1>
        <div className="movie-grid">
            {movieDetails.map((movie) => (
            <MovieCard key={movie.id} id={movie.id} title={movie.title} year={movie.year} />
            ))}
        </div>
    </>
  );
}
