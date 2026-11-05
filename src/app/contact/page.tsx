export default function ContactPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="display-heading text-4xl md:text-5xl">
        contact me
      </h1>

      <div className="mt-10 space-y-4 text-2xl md:text-3xl">
        <a
          href="mailto:ygetu21@gmail.com"
          className="block font-mono hover:opacity-80"
        >
          ygetu21@gmail.com
        </a>

        <a
          href="mailto:getu.1@osu.edu"
          className="block font-mono hover:opacity-80"
        >
          getu.1@osu.edu
        </a>

        <a
          href="https://github.com/ygetu22"
          target="_blank"
          rel="noreferrer"
          className="block font-mono hover:opacity-80"
        >
          ygetu22@github
        </a>

        <a
          href="https://www.linkedin.com/in/ygetu/"
          target="_blank"
          rel="noreferrer"
          className="block font-mono hover:opacity-80"
        >
          ygetu@linkedin
        </a>
      </div>
    </main>
  );
}
