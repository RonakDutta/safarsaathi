import { useState, useContext, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  CarFront,
  Clock3,
  ShieldCheck,
  Handshake,
  ChevronRight,
} from "lucide-react";
import { AuthContext } from "../context/authContext";
import Logo from "./Logo";

const links = [
  { to: "/", label: "Book a ride", end: true, icon: CarFront },
  { to: "/services", label: "Services", icon: Clock3 },
  { to: "/safety", label: "Safety", icon: ShieldCheck },
  { to: "/drive", label: "Drive with us", icon: Handshake },
];

function Navbar() {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // The menu remembers the page it was opened on, so any navigation
  // (a link, the back button) closes it without an extra effect.
  const [menuPath, setMenuPath] = useState(null);
  const isMenuOpen = menuPath === pathname;
  const closeMenu = () => setMenuPath(null);
  const toggleMenu = () => setMenuPath(isMenuOpen ? null : pathname);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuPath(null);
    const onResize = () =>
      window.matchMedia("(min-width: 64rem)").matches && setMenuPath(null);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const fullName = user?.full_name || user?.name || "";
  const firstName = (fullName || "there").split(" ")[0];
  const initial = (fullName || "?").charAt(0).toUpperCase();
  const dashboard =
    user?.role === "admin"
      ? { to: "/admin", label: "Admin panel" }
      : user?.role === "driver"
        ? { to: "/driver", label: "My rides" }
        : null;

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "bg-white/[0.07] text-white"
        : "text-fog/70 hover:bg-white/[0.04] hover:text-white"
    }`;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-md">
        <nav className="container-page flex h-16 items-center justify-between gap-4">
          <Logo onClick={closeMenu} />

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} className={linkClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 lg:flex">
            {isAuthenticated ? (
              <>
                <span className="mr-1 flex items-center gap-2.5 text-sm text-mute">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] text-xs font-semibold text-white">
                    {initial}
                  </span>
                  <span>
                    Hi,{" "}
                    <span className="font-medium text-white">{firstName}</span>
                  </span>
                </span>
                {dashboard && (
                  <Link to={dashboard.to} className="btn-primary px-5 py-2">
                    <LayoutDashboard size={16} />
                    {dashboard.label}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="btn-secondary h-9 w-9 p-0"
                  aria-label="Log out"
                  title="Log out"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2 text-sm font-medium text-fog transition-colors hover:bg-white/[0.04] hover:text-white"
                >
                  Log in
                </Link>
                <Link to="/signup" className="btn-primary px-5 py-2">
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button
            className={`flex h-10 w-10 items-center justify-center rounded-full border text-white transition-colors duration-200 active:scale-95 lg:hidden ${
              isMenuOpen
                ? "border-white/25 bg-white/10"
                : "border-white/15 hover:bg-white/5"
            }`}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 lg:hidden">
          <div
            aria-hidden="true"
            onClick={closeMenu}
            className="animate-fade absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div
            id="mobile-menu"
            className="animate-drop relative max-h-full overflow-y-auto rounded-b-3xl border-b border-white/[0.08] bg-coal shadow-2xl shadow-black"
          >
            <div className="container-page pt-3 pb-5">
              {isAuthenticated && (
                <div className="mb-3 flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-panel p-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber text-sm font-bold text-black">
                    {initial}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {fullName || firstName}
                    </p>
                    {user?.email && (
                      <p className="truncate text-xs text-mute">{user.email}</p>
                    )}
                  </div>
                </div>
              )}

              <ul className="space-y-1">
                {links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.to}>
                      <NavLink
                        to={link.to}
                        end={link.end}
                        onClick={closeMenu}
                        className={({ isActive }) =>
                          `group flex items-center gap-3.5 rounded-2xl px-3 py-3 text-[15px] font-medium transition-colors duration-200 active:bg-white/[0.06] ${
                            isActive
                              ? "bg-white/[0.06] text-white"
                              : "text-fog hover:bg-white/[0.04]"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                isActive
                                  ? "bg-amber text-black"
                                  : "bg-white/[0.06] text-fog/80"
                              }`}
                            >
                              <Icon size={18} />
                            </span>
                            {link.label}
                            <ChevronRight
                              size={18}
                              className="ml-auto text-dim transition-transform duration-200 group-hover:translate-x-0.5"
                            />
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 border-t border-white/[0.06] pt-4">
                {isAuthenticated ? (
                  <div
                    className={`grid gap-2 ${dashboard ? "grid-cols-2" : ""}`}
                  >
                    {dashboard && (
                      <Link
                        to={dashboard.to}
                        onClick={closeMenu}
                        className="btn-primary px-4"
                      >
                        <LayoutDashboard size={16} />
                        {dashboard.label}
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="btn-secondary px-4"
                    >
                      <LogOut size={16} />
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="btn-secondary px-4"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      onClick={closeMenu}
                      className="btn-primary px-4"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
