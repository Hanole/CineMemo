import "../../loading.css";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading movie details">
      <h1>Loading movie details...</h1>

      {/* skeleton loading state */}
      <div className="movie-details" aria-hidden="true">
        <div className="movie-details_poster skeleton" />

        <div className="movie-details_info">
          <div className="skeleton skeleton-title" />

          <div className="skeleton-text">
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-line-short" />
          </div>

          <div className="skeleton-text">
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-line-short" />
          </div>
        </div>
      </div>
    </div>
  );
}