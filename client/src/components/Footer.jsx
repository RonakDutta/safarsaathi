import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
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
    <footer className="border-t border-white/[0.06] bg-coal">
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.4fr_2fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-mute">
            Your saathi for city travel. Verified drivers you can hire by the
            hour, for errands, events and everything in between.
          </p>
          <a
            href="mailto:safarsaathi.cab@gmail.com"
            className="mt-5 inline-flex items-center gap-2 text-sm text-white hover:text-amber"
          >
            <Mail size={16} className="text-amber" />
            safarsaathi.cab@gmail.com
          </a>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-semibold text-white">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-fog/70 transition-colors hover:text-amber"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-dim sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} SafarSaathi. All rights reserved.</p>
          <p>Made for the roads of India.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
