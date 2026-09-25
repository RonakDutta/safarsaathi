import { formatINR } from "../lib/pricing";

const MAX = 24;
const R = 80;
const C = 2 * Math.PI * R;
const SWEEP = 0.75; // 270 degree dial
const ARC = C * SWEEP;

const tickAngle = (i) => 135 + (i * 270) / (MAX - 1);

// Speedometer style dial: fills amber as the booked hours go up.
function FareMeter({ hours, fare, className = "" }) {
  const progress = (hours - 1) / (MAX - 1);

  return (
    <div className={`relative aspect-square ${className}`}>
      <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="meter-fill" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffca2c" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffc107" />
          </linearGradient>
        </defs>

        {/* track */}
        <circle
          cx="100"
          cy="100"
          r={R}
          fill="none"
          stroke="#1e1e1e"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${ARC} ${C}`}
          transform="rotate(135 100 100)"
        />
        {/* fill */}
        <circle
          cx="100"
          cy="100"
          r={R}
          fill="none"
          stroke="url(#meter-fill)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${Math.max(ARC * progress, 0.01)} ${C}`}
          transform="rotate(135 100 100)"
          style={{
            transition: "stroke-dasharray 0.5s cubic-bezier(0.22,1,0.36,1)",
            filter: "drop-shadow(0 0 6px rgb(255 193 7 / 0.45))",
          }}
        />

        {/* hour ticks */}
        {Array.from({ length: MAX }, (_, i) => {
          const a = (tickAngle(i) * Math.PI) / 180;
          const major = i === 0 || (i + 1) % 6 === 0;
          const r1 = major ? 60 : 64;
          const r2 = 69;
          return (
            <line
              key={i}
              x1={100 + r1 * Math.cos(a)}
              y1={100 + r1 * Math.sin(a)}
              x2={100 + r2 * Math.cos(a)}
              y2={100 + r2 * Math.sin(a)}
              stroke={i < hours ? "#ffc107" : "#3a3a3a"}
              strokeWidth={major ? 2 : 1.25}
              strokeLinecap="round"
              style={{ transition: "stroke 0.3s" }}
            />
          );
        })}

        <text
          x="100"
          y="178"
          textAnchor="middle"
          fill="#5c5c5c"
          fontSize="9"
          fontWeight="600"
          letterSpacing="2"
        >
          HRS
        </text>
        <text x="34" y="170" textAnchor="middle" fill="#5c5c5c" fontSize="9">
          1
        </text>
        <text x="166" y="170" textAnchor="middle" fill="#5c5c5c" fontSize="9">
          24
        </text>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center pb-2">
        <span
          key={fare}
          className="animate-rise text-[2rem] leading-tight font-bold tracking-tight text-white tabular-nums sm:text-4xl"
        >
          {formatINR(fare)}
        </span>
        <span className="mt-0.5 rounded-full bg-amber/10 px-2.5 py-0.5 text-xs font-semibold text-amber tabular-nums">
          {hours} {hours === 1 ? "hour" : "hours"}
        </span>
      </div>
    </div>
  );
}

export default FareMeter;
