import { Link } from "react-router-dom";
import { ArrowUpRight, Mail } from "lucide-react";
import Logo from "./Logo";

const columns = [
  {
    title: "Ride",
    links: [
      { to: "/", label: "Book a driver" },
      { to: "/services", label: "Services and pricing" },
      { to: "/safety", label: "Safety" },
    ],
  },
  {
    title: "Drive",
    links: [
      { to: "/drive", label: "Become a driver" },
      { to: "/login", label: "Driver login" },
    ],
  },
  {
    title: "Account",
    links: [
      { to: "/login", label: "Log in" },
      { to: "/signup", label: "Create an account" },
    ],
  },
];

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-coal">
      <div className="checker h-3 [--sq:6px]" />

      <div className="container-page grid gap-12 pt-16 pb-10 lg:grid-cols-[1.4fr_2fr] lg:pt-20">
        <div className="max-w-sm">
          <Logo className="text-2xl" />
          <p className="mt-5 text-sm leading-relaxed text-mute">
            Your saathi for city travel. Verified drivers you can hire by the
            hour, for errands, events and everything in between.
          </p>
          <a
            href="mailto:safarsaathi.cab@gmail.com"
            className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-amber"
          >
            <Mail size={16} className="text-amber" />
            safarsaathi.cab@gmail.com
          </a>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-semibold text-white">
                {column.title}
              </h2>
              <ul className="mt-5 space-y-3.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="group inline-flex items-center gap-1 text-sm text-fog/80 transition-colors duration-200 hover:text-amber"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={14}
                        className="-translate-x-1 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="container-page">
        <p
          aria-hidden="true"
          className="text-outline -mb-[0.2em] text-center text-[19vw] leading-none font-extrabold tracking-[-0.06em] select-none lg:text-[13.5rem]"
        >
          SafarSaathi
        </p>
      </div>

      <div className="relative border-t border-white/[0.06] bg-coal">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-dim sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} SafarSaathi. All rights reserved.</p>
          <p>Made for the roads of India.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
