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
      <h2 className="display text-3xl leading-tight sm:text-5xl">{title}</h2>
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
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/70 via-black/85 to-black lg:bg-linear-to-r lg:from-black lg:via-black/75 lg:to-black/40" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t from-black to-transparent" />
    </>
  );
}

export function PageHero({ title, body, image, children, aside }) {
  return (
    <section className="relative isolate overflow-hidden">
      {image && <PhotoBackdrop src={image} />}
      <div
        className={`container-page pt-32 pb-16 sm:pt-40 lg:pb-24 ${
          aside
            ? "grid gap-12 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-center lg:gap-16"
            : ""
        }`}
      >
        <div className={aside ? "" : "max-w-3xl"}>
          <h1 className="display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          {body && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fog/80">
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

export function ClosingCta({ title, body, to = "/#book", action = "Book a driver" }) {
  return (
    <section className="container-page py-20">
      <div className="flex flex-col gap-8 rounded-3xl bg-amber px-8 py-12 text-black sm:px-12 sm:py-16 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl leading-tight font-bold tracking-tight sm:text-5xl">
            {title}
          </h2>
          {body && <p className="mt-4 text-black/70 sm:text-lg">{body}</p>}
        </div>
        <Link
          to={to}
          className="btn shrink-0 bg-black px-7 py-3.5 text-base text-white hover:bg-coal"
        >
          {action}
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
