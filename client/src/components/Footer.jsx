import { Link } from "react-router-dom";
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
    <footer className="border-t border-line bg-coal">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:py-16">
        <div className="max-w-xs sm:col-span-2 lg:col-span-1">
          <Logo className="text-2xl" />
          <p className="mt-4 text-sm leading-relaxed text-mute">
            Your reliable partner for city travel. Verified drivers you can hire
            by the hour, for errands, events and everything in between.
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
                    className="inline-block text-sm text-mute transition-[color,transform] duration-200 hover:translate-x-1 hover:text-amber"
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
