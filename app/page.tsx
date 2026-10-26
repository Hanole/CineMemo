import Link from "next/link";

export default function Home() {
  return (
    <section className="home-page-intro">
      <h1>Discover your next movie</h1>

      <p>
        Explore popular movies, search for a title, or browse by genre.
      </p>

      <p>Find out more about each movie, including its story, director, runtime and cast.</p>

      <Link href="/movies">Explore movies!</Link>

    </section>
  );
}
