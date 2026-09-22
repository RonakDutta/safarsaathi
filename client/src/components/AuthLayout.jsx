import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "./Logo";

const AUTH_IMAGE =
  "https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=1400&auto=format&fit=crop";

function AuthLayout({ title, description, children, footer }) {
  return (
    <div className="grid min-h-screen bg-ink lg:grid-cols-[1fr_1.1fr]">
      {/* Image side */}
      <div className="relative hidden overflow-hidden border-r border-line lg:block">
        <img
          src={AUTH_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-black/10" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo />
          <p className="max-w-sm text-2xl leading-snug font-medium text-white">
            Verified drivers, booked by the hour, with every detail on your
            WhatsApp before pickup.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo className="lg:invisible" />
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            {title}
          </h1>
          {description && <p className="mt-2 text-mute">{description}</p>}

          <div className="mt-10">{children}</div>

          {footer && <p className="mt-8 text-sm text-mute">{footer}</p>}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
