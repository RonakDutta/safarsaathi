import { Link } from "react-router-dom";
import { CarTaxiFront } from "lucide-react";

function Logo({ suffix, className = "", onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={`group inline-flex items-center gap-2.5 text-xl font-bold tracking-tight text-white ${className}`}
    >
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-amber text-black transition-transform duration-300 group-hover:-rotate-6">
        <CarTaxiFront size={20} strokeWidth={2.25} />
      </span>
      <span className="leading-none">
        Safar<span className="text-amber">Saathi</span>
      </span>
      {suffix && (
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium tracking-wide text-mute uppercase">
          {suffix}
        </span>
      )}
    </Link>
  );
}

export default Logo;
