import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

function ClosingCta({ title, body, to = "/", action = "Book a driver" }) {
  return (
    <section className="container-page pb-20 lg:pb-28">
      <Reveal>
        <div className="rounded-3xl border border-line bg-raise px-7 py-12 text-center sm:px-12 sm:py-16">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            {title}
          </h2>
          {body && (
            <p className="mx-auto mt-4 max-w-lg leading-relaxed text-mute">
              {body}
            </p>
          )}
          <Link
            to={to}
            className="btn-primary group mt-8 px-7 py-3.5 text-base"
          >
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
