import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Clock, MessageCircle } from "lucide-react";
import Logo from "./Logo";
import { images } from "../lib/images";

const points = [
  { icon: ShieldCheck, label: "Every driver verified by our team" },
  { icon: Clock, label: "Book from 1 to 24 hours" },
  { icon: MessageCircle, label: "Driver details straight to WhatsApp" },
];

function AuthLayout({ title, description, children, footer }) {
  return (
    <div className="grid min-h-screen bg-ink lg:grid-cols-[1fr_1.1fr]">
      {/* Image side */}
      <div className="relative hidden overflow-hidden bg-panel lg:block">
        <img
          src={images.auth}
          alt=""
          className="animate-slow-zoom absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-black/20" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo className="text-2xl" />
          <div className="animate-rise [animation-delay:200ms]">
            <p className="max-w-md text-3xl leading-snug font-semibold text-white">
              Your trusted <span className="text-amber">saathi</span> for every
              journey in the city.
            </p>
            <ul className="mt-8 space-y-3">
              {points.map((point) => {
                const Icon = point.icon;
                return (
                  <li
                    key={point.label}
                    className="flex items-center gap-3 text-fog/90"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-amber backdrop-blur-sm">
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
      <div className="flex flex-col px-5 py-6 sm:px-10 sm:py-8">
        <div className="flex items-center justify-between">
          <Logo className="text-2xl lg:invisible" />
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-mute transition-colors duration-200 hover:border-edge hover:text-white"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
            Home
          </Link>
        </div>

        <div className="animate-rise mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="text-3xl font-semibold text-white">{title}</h1>
          {description && <p className="mt-2 text-mute">{description}</p>}

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
