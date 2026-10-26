import "./../loading.css";

export default function MovieSkeleton() {
  return (
    <div role="status" aria-label="Loading movies">
      <h1>Loading movies...</h1>
      
      <div className="movie-grid" aria-hidden="true">
        {Array.from({ length: 20 }, (_, index) => (
          <div className="movie-card" key={index}>
            <div className="movie-card_poster skeleton" />

            <div className="movie-card_predetail">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-year" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
