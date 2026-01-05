import Image from "next/image";
import Link from "next/link";

function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3v10" />
      <path d="M7 11l5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

export default function Home() {
  return (
    <section className="relative">
      <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-16 md:grid-cols-2">
        <div className="space-y-5">
          <p className="text-sm opacity-80">Hey, I am</p>

          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Yakob Getu
          </h1>

          <div className="space-y-3 text-base leading-7 opacity-90">
            <p>
              I am a Computer Science and Engineering student at Ohio State,
              focused on full stack development.
            </p>

        <p>
          This summer I will be a Software Engineering Intern at{" "}
          <a
            href="https://www.jpmorganchase.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 align-middle hover:opacity-80"
            aria-label="Open JPMorgan Chase website"
          >
            <span className="sr-only">JPMorgan Chase</span>
            <Image
              src="/chaseLogo.png"
              alt="JPMorgan Chase"
              width={120}
              height={28}
              className="h-7 w-auto object-contain"
              priority={false}
            />
          </a>
        </p>


            <p>
              I like building clean projects, shipping real features, and writing
              down what I learn.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Link
              href="/projects"
              className="rounded-full border border-black/20 px-3 py-1 text-sm hover:opacity-80 dark:border-white/20"
            >
              projects
            </Link>

            <Link
              href="/posts"
              className="rounded-full border border-black/20 px-3 py-1 text-sm hover:opacity-80 dark:border-white/20"
            >
              posts
            </Link>

            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-black/20 px-3 py-1 text-sm hover:opacity-80 dark:border-white/20"
            >
              github
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-black/20 px-3 py-1 text-sm hover:opacity-80 dark:border-white/20"
            >
              linkedin
            </a>

            <Link
              href="/contact"
              className="rounded-full border border-black/20 px-3 py-1 text-sm hover:opacity-80 dark:border-white/20"
            >
              contact
            </Link>
          </div>

          <a
            href="/yakob_resume_cse.pdf"
            download
            className="inline-flex items-center gap-2 rounded-lg border border-black/20 px-4 py-2 text-sm font-medium hover:opacity-80 dark:border-white/20"
          >
            <DownloadIcon />
            Download Resume
          </a>
          <p className="text-xs opacity-70">
            Last updated: Jan 5, website still in progress!
          </p>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="relative h-[340px] w-[260px] overflow-hidden rounded-3xl">
            <Image
            src="/me.JPG"
            alt="Yakob"
            fill
            priority
            className="object-cover object-[50%_35%] scale-125"
            sizes="(max-width: 768px) 260px, 340px"
          />
          </div>
        </div>
      </div>
    </section>
  );
}
