import Image from "next/image";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center pt-10">
      <Image
        src="/me.png"
        alt="Yakob"
        width={220}
        height={220}
        priority
        className="h-auto w-[220px] rounded-xl object-cover"
      />

      <p className="mt-8 text-sm opacity-80">Content is coming soon.</p>
    </div>
  );
}
