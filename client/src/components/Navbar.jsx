import { useState, useContext, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { X, ArrowUpRight, LayoutDashboard, LogOut } from "lucide-react";
import { AuthContext } from "../context/authContext";
import Logo from "./Logo";

const links = [
  { to: "/", label: "Book a ride", end: true },
  { to: "/services", label: "Services" },
  { to: "/safety", label: "Safety" },
  { to: "/drive", label: "Drive with us" },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const firstName = (user?.full_name || user?.name || "there").split(" ")[0];
  const dashboard =
    user?.role === "admin"
      ? { to: "/admin", label: "Admin panel" }
      : user?.role === "driver"
        ? { to: "/driver", label: "My rides" }
        : null;

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll and listen for Escape while the menu is open
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e) => e.key === "Escape" && setIsMenuOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setIsMenuOpen(false);
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <nav
          className={`mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border pr-2 pl-4 transition-[background-color,border-color,box-shadow] duration-300 sm:pl-5 ${
            scrolled
              ? "border-white/10 bg-black/90 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.9)] lg:bg-black/70 lg:backdrop-blur-xl"
              : "border-white/[0.06] bg-black/60 lg:bg-black/30 lg:backdrop-blur-md"
          }`}
        >
          <Logo className="text-lg sm:text-xl" />

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-white after:absolute after:inset-x-4 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-amber"
                        : "text-fog/70 hover:text-white"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop account */}
          <div className="hidden items-center gap-2 lg:flex">
            {isAuthenticated ? (
              <>
                <span className="mr-2 flex items-center gap-2 text-sm text-mute">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white uppercase">
                    {firstName.charAt(0)}
                  </span>
                  <span className="font-medium text-white">{firstName}</span>
                </span>
                {dashboard && (
                  <Link to={dashboard.to} className="btn-primary px-5 py-2.5">
                    <LayoutDashboard size={16} />
                    {dashboard.label}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-mute transition-colors duration-200 hover:border-danger/60 hover:text-danger"
                  aria-label="Log out"
                  title="Log out"
                >
                  <LogOut size={17} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2.5 text-sm font-medium text-fog transition-colors hover:text-white"
                >
                  Log in
                </Link>
                <Link to="/signup" className="btn-primary px-5 py-2.5">
                  Get started
                  <ArrowUpRight size={16} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile trigger */}
          <button
            className="flex h-12 items-center gap-2 rounded-full bg-amber pr-4 pl-3.5 text-sm font-semibold text-black transition-transform active:scale-95 lg:hidden"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="flex flex-col gap-[4px]">
              <span className="h-0.5 w-4 rounded-full bg-black" />
              <span className="h-0.5 w-2.5 rounded-full bg-black" />
            </span>
            Menu
          </button>
        </nav>
      </header>

      {/* Mobile menu. Full screen sheet, outside the header so the
          header's backdrop blur cannot trap it. */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`fixed inset-0 z-[70] flex flex-col overflow-hidden bg-ink transition-[opacity,visibility] duration-300 lg:hidden ${
          isMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="bg-grid mask-fade pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 glow [--glow:0.28]" />

        <div className="relative flex items-center justify-between px-5 pt-5">
          <Logo className="text-lg" onClick={closeMenu} />
          <button
            onClick={closeMenu}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white transition-transform duration-300 active:scale-90"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <div className="relative flex flex-1 flex-col overflow-y-auto px-5 pt-10 pb-8">
          {isAuthenticated && (
            <p className="mb-6 text-sm text-mute">
              Signed in as{" "}
              <span className="font-medium text-white">{firstName}</span>
            </p>
          )}

          <ul className="flex flex-col">
            {links.map((link, index) => (
              <li
                key={link.to}
                className={`border-b border-white/[0.07] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{
                  transitionDelay: isMenuOpen ? `${80 + index * 60}ms` : "0ms",
                }}
              >
                <NavLink
                  to={link.to}
                  end={link.end}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `group flex items-center gap-4 py-5 text-[1.75rem] font-semibold tracking-tight transition-colors ${
                      isActive ? "text-amber" : "text-white"
                    }`
                  }
                >
                  <span className="w-7 text-xs font-medium text-dim tabular-nums">
                    0{index + 1}
                  </span>
                  {link.label}
                  <ArrowUpRight size={22} className="ml-auto text-dim" />
                </NavLink>
              </li>
            ))}
          </ul>

          <div
            className={`mt-auto flex flex-col gap-3 pt-10 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: isMenuOpen ? "340ms" : "0ms" }}
          >
            {isAuthenticated ? (
              <>
                {dashboard && (
                  <Link
                    to={dashboard.to}
                    onClick={closeMenu}
                    className="btn-primary py-4 text-base"
                  >
                    <LayoutDashboard size={18} />
                    {dashboard.label}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="btn-danger py-4 text-base"
                >
                  <LogOut size={18} />
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="btn-primary py-4 text-base"
                >
                  Create an account
                </Link>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="btn-secondary py-4 text-base"
                >
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="checker relative h-3 shrink-0 [--sq:6px]" />
      </div>
    </>
  );
}

export default Navbar;
