export default function PhotoPlaceholder({ label, number }: { label: string; number?: string }) {
  return (
    <div className="photo-placeholder absolute inset-0 grid place-items-center overflow-hidden" role="img" aria-label={label}>
      <div aria-hidden="true" className="photo-placeholder-orbit" />
      <div className="relative flex flex-col items-center gap-4 px-6 text-center">
        <span aria-hidden="true" className="font-serif text-7xl italic text-foreground/20 sm:text-8xl">{number || "yg"}</span>
        <span className="text-[10px] uppercase tracking-[0.24em] text-foreground/45">{label}</span>
      </div>
    </div>
  );
}
