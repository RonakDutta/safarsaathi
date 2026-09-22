import { Link } from "react-router-dom";
import Logo from "./Logo";

const columns = [
  {
    title: "Ride",
    links: [
      { to: "/", label: "Book a driver" },
      { to: "/services", label: "Services & pricing" },
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
];

function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-mute">
            Verified, professional drivers you can hire by the hour — for
            errands, events, and everything in between.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="text-sm font-semibold text-white">{column.title}</h2>
            <ul className="mt-4 space-y-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-mute transition-colors hover:text-amber"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <p className="container-page py-6 text-xs text-dim">
          &copy; {new Date().getFullYear()} SafarSaathi. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
