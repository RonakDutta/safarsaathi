import { Link } from "react-router-dom";

function Logo({ suffix, className = "" }) {
  return (
    <Link
      to="/"
      className={`text-xl font-semibold tracking-tight text-white ${className}`}
    >
      Safar<span className="text-amber">Saathi</span>
      {suffix && (
        <span className="ml-2 border-l border-line pl-2 text-sm font-normal text-mute">
          {suffix}
        </span>
      )}
    </Link>
  );
}

export default Logo;
