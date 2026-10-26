import Link from "next/link";


export default function Navbar() {
    return (
        <header>
            <Link href="/">CineMemo</Link>
            <nav>
                <Link href="/about">About</Link>
                <Link href="/movies">Explore movies</Link>
            </nav>
        </header>
    )
}