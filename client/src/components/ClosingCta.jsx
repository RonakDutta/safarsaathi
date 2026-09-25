import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

function ClosingCta({ title, body, to = "/", action = "Book a driver" }) {
  return (
    <section className="container-page pb-20 lg:pb-28">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-white/[0.07] bg-panel px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="bg-grid mask-fade absolute inset-0 -z-10" />
          <div className="absolute bottom-[-10rem] left-1/2 -z-10 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-amber/20 blur-[110px]" />
          <div className="checker absolute inset-x-0 top-0 h-2 [--sq:4px]" />

          <h2 className="display mx-auto max-w-2xl text-3xl leading-tight sm:text-5xl">
            {title}
          </h2>
          {body && (
            <p className="mx-auto mt-5 max-w-lg leading-relaxed text-mute sm:text-lg">
              {body}
            </p>
          )}
          <Link to={to} className="btn-primary group mt-9 px-8 py-4 text-base">
            {action}
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

export default ClosingCta;
