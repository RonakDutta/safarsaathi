import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Clock, MessageCircle } from "lucide-react";
import Logo from "./Logo";
import FareMeter from "./FareMeter";
import { HOURLY_RATE } from "../lib/pricing";

const points = [
  { icon: ShieldCheck, label: "Every driver verified by our team" },
  { icon: Clock, label: "Book from 1 to 24 hours" },
  { icon: MessageCircle, label: "Driver details straight to WhatsApp" },
];

function AuthLayout({ title, description, children, footer }) {
  return (
    <div className="grid min-h-screen bg-ink lg:grid-cols-[1.05fr_1fr]">
      {/* Brand side */}
      <div className="relative isolate hidden overflow-hidden border-r border-white/[0.06] bg-coal lg:flex lg:flex-col">
        <div className="bg-grid mask-fade absolute inset-0 -z-10" />
        <div className="absolute top-1/3 left-1/2 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 glow [--glow:0.21]" />
        <div className="checker h-3 [--sq:6px]" />

        <div className="flex flex-1 flex-col justify-between p-12 xl:p-16">
          <Logo className="text-2xl" />

          <div className="animate-float mx-auto w-full max-w-[17rem] rounded-[2rem] border border-white/[0.08] bg-panel p-6 shadow-[0_40px_100px_-30px_rgb(0_0_0/1)]">
            <FareMeter hours={4} fare={4 * HOURLY_RATE} />
          </div>

          <div className="animate-rise [animation-delay:200ms]">
            <p className="max-w-md text-4xl leading-[1.1] font-bold tracking-tight text-white">
              Your trusted <span className="text-amber">saathi</span> for every
              journey in the city.
            </p>
            <ul className="mt-8 space-y-3">
              {points.map((point) => {
                const Icon = point.icon;
                return (
                  <li
                    key={point.label}
                    className="flex items-center gap-3 text-fog/85"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber/20 bg-amber/10 text-amber">
                      <Icon size={17} />
                    </span>
                    {point.label}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="relative isolate flex flex-col px-4 py-5 sm:px-10 sm:py-8">
        <div className="absolute top-0 right-0 -z-10 h-72 w-72 glow [--glow:0.14] lg:hidden" />
        <div className="flex items-center justify-between">
          <Logo className="text-xl lg:invisible" />
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm text-mute transition-colors duration-200 hover:border-white/30 hover:text-white"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
            Home
          </Link>
        </div>

        <div className="animate-rise mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <h1 className="display text-4xl leading-tight sm:text-5xl">{title}</h1>
          {description && (
            <p className="mt-3 text-mute sm:text-lg">{description}</p>
          )}

          <div className="mt-10">{children}</div>

          {footer && (
            <p className="mt-8 text-center text-sm text-mute">{footer}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
