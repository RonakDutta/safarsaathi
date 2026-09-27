import { Link } from "react-router-dom";

function Logo({ suffix, className = "", onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={`group inline-flex items-center gap-2 text-xl font-bold tracking-tight text-white ${className}`}
    >
      <span className="leading-none">
        Safar<span className="text-amber">Saathi</span>
      </span>
      {suffix && (
        <span className="hidden rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] min-[400px]:inline font-medium tracking-wide text-mute uppercase">
          {suffix}
        </span>
      )}
    </Link>
  );
}

export default Logo;
