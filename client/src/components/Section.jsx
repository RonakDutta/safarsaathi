import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  title,
  body,
  align = "left",
  className = "",
  children,
}) {
  const centered = align === "center";
  return (
    <div
      className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      <h2 className="display text-[1.75rem] leading-tight sm:text-4xl lg:text-5xl lg:leading-[1.15]">
        {title}
      </h2>
      {body && (
        <p
          className={`mt-4 leading-relaxed text-mute sm:text-lg ${centered ? "mx-auto max-w-xl" : "max-w-xl"}`}
        >
          {body}
        </p>
      )}
      {children}
    </div>
  );
}

export function PhotoBackdrop({ src, position = "center" }) {
  return (
    <>
      <img
        src={src}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        style={{ objectPosition: position }}
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/75 via-black/85 to-black lg:bg-linear-to-r lg:from-black lg:via-black/80 lg:to-black/45" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t from-black to-transparent" />
    </>
  );
}

export function PageHero({ title, body, image, children, aside }) {
  return (
    <section className="relative isolate overflow-hidden">
      {image && <PhotoBackdrop src={image} />}
      <div
        className={`container-page pt-28 pb-16 sm:pt-40 lg:pb-24 ${
          aside
            ? "grid gap-10 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-center lg:gap-16"
            : ""
        }`}
      >
        <div className={aside ? "" : "max-w-3xl"}>
          <h1 className="display text-[2.5rem] leading-[1.1] sm:text-5xl lg:text-6xl lg:leading-[1.1]">
            {title}
          </h1>
          {body && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-fog/80 sm:text-lg">
              {body}
            </p>
          )}
          {children}
        </div>
        {aside && <div>{aside}</div>}
      </div>
    </section>
  );
}

export function ClosingCta({
  title,
  body,
  to = "/#book",
  action = "Book a driver",
}) {
  return (
    <section className="container-page py-16 sm:py-20">
      <div className="relative isolate flex flex-col gap-8 overflow-hidden rounded-3xl bg-amber px-6 py-10 text-black sm:px-12 sm:py-16 lg:flex-row lg:items-center lg:justify-between">
        {/* Soft rings for a little depth, kept behind the content. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full border-[40px] border-black/[0.05]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 h-64 w-64 rounded-full bg-white/25 blur-3xl"
        />
        <div className="max-w-2xl">
          <h2 className="text-[1.75rem] leading-tight font-bold sm:text-4xl lg:text-5xl lg:leading-[1.15]">
            {title}
          </h2>
          {body && (
            <p className="mt-4 leading-relaxed text-black/70 sm:text-lg">
              {body}
            </p>
          )}
        </div>
        <Link
          to={to}
          className="btn group shrink-0 self-start bg-black px-7 py-3.5 text-base font-semibold text-white hover:bg-coal lg:self-auto"
        >
          {action}
          <ArrowRight
            size={18}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </section>
  );
}
