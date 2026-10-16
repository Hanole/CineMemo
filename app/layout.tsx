import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Roboto } from "next/font/google";


export const metadata: Metadata = {
  title: "CineMemo",
  description: "Explore movies",
};

const roboto = Roboto ({
  subsets: ["latin"]
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}