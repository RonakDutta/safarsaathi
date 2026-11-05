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
    <div className="grid min-h-screen bg-ink lg:grid-cols-2">
      <div className="relative isolate hidden flex-col justify-between overflow-hidden p-12 lg:flex xl:p-16">
        <img
          src={images.taxi}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[40%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-black via-black/80 to-black/50" />
        <Logo className="text-2xl" />

        <div>
          <p className="max-w-md text-4xl leading-tight font-bold tracking-tight text-white">
            Your trusted <span className="text-amber">saathi</span> for every
            journey in the city.
          </p>
          <ul className="mt-8 space-y-4">
            {points.map((point) => {
              const Icon = point.icon;
              return (
                <li key={point.label} className="flex items-center gap-3 text-fog/85">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber/15 text-amber">
                    <Icon size={18} />
                  </span>
                  {point.label}
                </li>
              );
            })}
          </ul>
        </div>

        <p className="text-xs text-dim">
          &copy; {new Date().getFullYear()} SafarSaathi
        </p>
      </div>

      <div className="flex flex-col px-4 py-5 sm:px-10 sm:py-8">
        <div className="flex items-center justify-between">
          <Logo className="lg:invisible" />
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-mute hover:text-white"
          >
            <ArrowLeft size={16} />
            Home
          </Link>
        </div>

        <div className="animate-fade mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="display text-3xl">{title}</h1>
          {description && <p className="mt-2 text-mute">{description}</p>}

          <div className="mt-8">{children}</div>

          {footer && (
            <p className="mt-8 text-center text-sm text-mute">{footer}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
