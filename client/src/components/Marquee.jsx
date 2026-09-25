import { Asterisk } from "lucide-react";

// Endless ticker of short phrases on a black band.
function Marquee({ items, className = "" }) {
  const row = (hidden) => (
    <ul
      className="flex shrink-0 items-center gap-8 pr-8"
      aria-hidden={hidden || undefined}
    >
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-8 text-lg font-semibold tracking-tight whitespace-nowrap text-white sm:text-2xl"
        >
          {item}
          <Asterisk size={22} className="text-amber" strokeWidth={3} />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={`relative flex overflow-hidden border-y border-white/[0.07] bg-coal py-5 sm:py-6 ${className}`}
    >
      <div className="animate-marquee flex w-max hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-coal to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-coal to-transparent" />
    </div>
  );
}

export default Marquee;
