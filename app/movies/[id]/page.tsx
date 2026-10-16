import Link from "next/link";
import { movieDetails } from "@/app/data/movies";
import { notFound } from "next/navigation";

type MovieDetailsProps = {
  params: Promise<{ id: string }>;
};

export default async function MovieDetails({ params }: MovieDetailsProps) {
  const { id } = await params;
  const movie = movieDetails.find((movie) => movie.id === Number(id));
  if (!movie) {
    notFound();
  }
  return (
    <>
      <Link href="/movies/">Go back to movies</Link>
      <h1>{movie.title}</h1>
      <p>{movie.year}</p>
      <p>{movie.description}</p>
      <p>{movie.runtime} minutter</p>
    </>
  );
}
