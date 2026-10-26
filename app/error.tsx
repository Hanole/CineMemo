"use client"

import Link from "next/link";

export default function Error() {
    return (
        <section className="home-page-intro">
            <h1> Something went wrong...</h1>
            <p>
                The content could not load at the moment.
                Please try again later.
            </p>
            <Link href="/">Go back to the homepage</Link>
        </section>
    )
}