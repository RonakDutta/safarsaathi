import Reveal from "./Reveal";

// Headline and intro used to open each section.
export function SectionHeading({
  title,
  body,
  align = "left",
  className = "",
  children,
}) {
  const centered = align === "center";
  return (
    <Reveal
      className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      <h2 className="display text-[2rem] leading-[1.08] sm:text-5xl">
        {title}
      </h2>
      {body && (
        <p
          className={`mt-5 text-base leading-relaxed text-mute sm:text-lg ${centered ? "mx-auto max-w-xl" : "max-w-xl"}`}
        >
          {body}
        </p>
      )}
      {children}
    </Reveal>
  );
}

// Big type hero for the inner pages, set on the map grid with an amber glow.
export function PageHero({ title, body, children, aside }) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="bg-grid mask-fade-b absolute inset-0 -z-10" />
      <div className="absolute top-[-12rem] left-1/2 -z-10 h-[28rem] w-[46rem] -translate-x-1/2 rounded-full bg-amber/[0.13] blur-[130px]" />

      <div
        className={`container-page pt-32 pb-16 sm:pt-40 lg:pb-24 ${
          aside ? "grid gap-12 lg:grid-cols-[minmax(0,1fr)_28rem] lg:gap-16" : ""
        }`}
      >
        <div className={aside ? "animate-rise" : "animate-rise max-w-4xl"}>
          <h1 className="display text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          {body && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">
              {body}
            </p>
          )}
          {children}
        </div>
        {aside && (
          <div className="animate-rise [animation-delay:150ms]">{aside}</div>
        )}
      </div>
    </section>
  );
}
