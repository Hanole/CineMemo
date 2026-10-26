export default function About() {
  return (
    <article className="about-page">
      <h1>About CineMemo</h1>

      <section>
        <h2>What is CineMemo?</h2>
        <p>
          CineMemo is a movie discovery website for people who want to explore
          movies and find something to watch.
        </p>
        <p>
          You can explore popular movies, search by title and filter by genre.
          Each movie has a detail page with more information about its story,
          director and cast.
        </p>
      </section>

      <section>
        <h2>Movie data</h2>
        <p>
          Movie information and poster images ar provided by The Movie Database
          (TMDB). Some movies may have missing information or images.
        </p>
      </section>

      <section>
        <h2>Search limitations</h2>
        <p>
          When combining a title search with a genre, CineMemo checks up to the
          first 250 search pages. Broad searches may take several seconds to
          load.
        </p>
        <p>
          Matches beyond this limit are not included. The displayed page count
          reflects only the results retrieved and filtered by CineMemo.
        </p>
      </section>

      <section>
        <p>
          CineMemo was created by Ole-Magnus Stallvik as a student project using
          Next.js.
        </p>
      </section>
    </article>
  );
}
