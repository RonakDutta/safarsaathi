import { Link } from "react-router-dom";

function Logo({ suffix, className = "", onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={`group text-xl font-bold tracking-tight text-white transition-colors duration-300 hover:text-amber ${className}`}
    >
      Safar
      <span className="text-amber transition-colors duration-300 group-hover:text-white">
        Saathi
      </span>
      {suffix && (
        <span className="ml-2 border-l border-line pl-2 text-sm font-normal text-mute">
          {suffix}
        </span>
      )}
    </Link>
  );
}

export default Logo;
