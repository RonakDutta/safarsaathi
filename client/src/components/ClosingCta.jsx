import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function ClosingCta({ title, body, to = "/", action = "Book a driver" }) {
  return (
    <section className="border-t border-line">
      <div className="container-page flex flex-col gap-8 py-20 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          {body && <p className="mt-4 leading-relaxed text-mute">{body}</p>}
        </div>
        <Link to={to} className="btn-primary shrink-0 px-6 py-3.5 text-base">
          {action}
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}

export default ClosingCta;
