import Image from "next/image";
import Link from "next/link";

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      {...props}
    >
      <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.77.6-3.35-1.18-3.35-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.5 9.5 0 0112 6.8c.85 0 1.7.11 2.5.33 1.9-1.29 2.74-1.02 2.74-1.02.56 1.37.21 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0012 2z" />
    </svg>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      {...props}
    >
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0.5 8.5H4.5V24H0.5zM8.5 8.5h3.83v2.11h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.14V24h-4v-8.26c0-1.97-.04-4.5-2.74-4.5-2.74 0-3.16 2.14-3.16 4.36V24h-4z" />
    </svg>
  );
}

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
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/20 hover:opacity-80 dark:border-white/20"
              aria-label="GitHub"
            >
              <span className="sr-only">GitHub</span>
              <GitHubIcon className="h-4 w-4" />
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/20 hover:opacity-80 dark:border-white/20"
              aria-label="LinkedIn"
            >
              <span className="sr-only">LinkedIn</span>
              <LinkedInIcon className="h-4 w-4" />
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
