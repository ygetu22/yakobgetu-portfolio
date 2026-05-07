import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full py-6 text-center text-xs opacity-70">
      <div className="mx-auto max-w-5xl px-4">
        <span>Yakob @ {year}</span>
        <span>{" · "}</span>
        <Link href="/contact" className="hover:underline">
          contact
        </Link>
      </div>
    </footer>
  );
}
