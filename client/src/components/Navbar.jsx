import { useState, useContext, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { X, ChevronRight, LayoutDashboard, LogOut } from "lucide-react";
import { AuthContext } from "../context/authContext";
import Logo from "./Logo";

const links = [
  { to: "/services", label: "Services" },
  { to: "/safety", label: "Safety" },
  { to: "/drive", label: "Drive with us" },
];

function Navbar({ overlay = false }) {
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
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll and listen for Escape while the drawer is open
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e) => e.key === "Escape" && setIsMenuOpen(false);
    const onResize = () => window.innerWidth >= 768 && setIsMenuOpen(false);
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [isMenuOpen]);

  const solid = scrolled || !overlay;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          solid
            ? "border-b border-line bg-[rgba(18,18,18,0.85)] backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="container-page flex h-16 items-center justify-between md:h-[72px]">
          <Logo className="text-2xl" />

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-fog/80 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop account */}
          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <span className="mr-1 text-sm text-mute">
                  Hi,{" "}
                  <span className="font-medium text-white">{firstName}</span>
                </span>
                {dashboard && (
                  <Link
                    to={dashboard.to}
                    className="rounded-full border border-amber/60 px-5 py-2 text-sm font-medium text-amber transition-colors duration-200 hover:bg-amber hover:text-black"
                  >
                    {dashboard.label}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-edge px-5 py-2 text-sm font-medium text-fog transition-colors duration-200 hover:border-danger/70 hover:text-danger"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full border border-[#444] px-5 py-2 text-sm font-medium text-white transition-colors duration-200 hover:border-white"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-amber px-5 py-2 text-sm font-semibold text-black transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-amber-soft active:scale-95"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="-mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full md:hidden"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="h-0.5 w-5 rounded-full bg-white" />
            <span className="h-0.5 w-5 rounded-full bg-amber" />
            <span className="h-0.5 w-5 rounded-full bg-white" />
          </button>
        </nav>
      </header>

      {/* Mobile drawer. Lives outside the header because the header's
          backdrop blur would otherwise trap this fixed element inside it. */}
      <div
        className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <aside
        id="mobile-menu"
        className={`fixed inset-y-0 right-0 z-[70] flex w-[86%] max-w-sm flex-col border-l border-line bg-panel shadow-2xl transition-[transform,visibility] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          isMenuOpen ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
        aria-label="Menu"
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <Logo className="text-xl" onClick={closeMenu} />
          <button
            onClick={closeMenu}
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-fog transition-[color,transform] duration-300 hover:rotate-90 hover:text-amber"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-5 py-6">
          {isAuthenticated && (
            <p className="mb-4 px-1 text-sm text-mute">
              Signed in as{" "}
              <span className="font-medium text-white">{firstName}</span>
            </p>
          )}

          <ul className="flex flex-col gap-1">
            {links.map((link, index) => (
              <li
                key={link.to}
                className={`transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-6 opacity-0"
                }`}
                style={{
                  transitionDelay: isMenuOpen ? `${120 + index * 60}ms` : "0ms",
                }}
              >
                <NavLink
                  to={link.to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-4 py-4 text-lg font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-raise text-amber"
                        : "text-white active:bg-raise"
                    }`
                  }
                >
                  {link.label}
                  <ChevronRight size={18} className="text-dim" />
                </NavLink>
              </li>
            ))}
          </ul>

          <div
            className={`mt-auto flex flex-col gap-3 pt-8 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"
            }`}
            style={{ transitionDelay: isMenuOpen ? "320ms" : "0ms" }}
          >
            {isAuthenticated ? (
              <>
                {dashboard && (
                  <Link
                    to={dashboard.to}
                    onClick={closeMenu}
                    className="btn-primary py-3.5"
                  >
                    <LayoutDashboard size={18} />
                    {dashboard.label}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="btn border border-danger/50 py-3.5 text-danger hover:bg-danger/10"
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
                  className="btn-primary py-3.5"
                >
                  Sign up
                </Link>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="btn-secondary py-3.5"
                >
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Navbar;
