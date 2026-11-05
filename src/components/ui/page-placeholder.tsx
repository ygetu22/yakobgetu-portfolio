import Link from "next/link";

type PagePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function PagePlaceholder(props: PagePlaceholderProps) {
  const { eyebrow, title, description } = props;

  return (
    <main className="mx-auto max-w-5xl px-6 pb-16 pt-24 sm:pt-28">
      <section className="relative overflow-hidden rounded-[2.25rem] border border-black/10 bg-background/80 px-6 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur dark:border-white/10 dark:shadow-[0_20px_60px_rgba(0,0,0,0.28)] md:px-10 md:py-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.11),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.12),transparent_26%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.1),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.1),transparent_26%)]" />

        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-60">{eyebrow}</p>
            <div className="space-y-3">
              <h1 className="display-heading text-4xl md:text-5xl">{title}</h1>
              <p className="max-w-2xl text-base leading-8 opacity-75 md:text-lg">{description}</p>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-black/10 bg-background/75 p-5 dark:border-white/10 dark:bg-black/30">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-60">Status</p>
            <div className="mt-4 space-y-4">
              <p className="text-2xl font-semibold tracking-tight">Coming soon.</p>
              <p className="text-sm leading-7 opacity-72">
                This section is still in progress and will be updated soon.
              </p>

              <div className="flex flex-wrap gap-3 pt-2 text-sm">
                <Link
                  href="/"
                  className="rounded-full bg-foreground px-4 py-2 font-medium text-background transition hover:-translate-y-0.5 hover:opacity-90"
                >
                  Home
                </Link>
                <Link
                  href="/resume"
                  className="rounded-full border border-black/10 px-4 py-2 font-medium transition hover:-translate-y-0.5 hover:opacity-90 dark:border-white/10"
                >
                  Resume
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
