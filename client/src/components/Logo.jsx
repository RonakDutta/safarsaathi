import { Link } from "react-router-dom";

function Logo({ suffix, className = "", onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={`group inline-flex items-center gap-2 text-xl font-bold tracking-normal text-white ${className}`}
    >
      <span className="leading-none">
        Safar<span className="text-amber">Saathi</span>
      </span>
      {suffix && (
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] leading-4 font-semibold tracking-wider text-mute uppercase">
          {suffix}
        </span>
      )}
    </Link>
  );
}

export default Logo;
