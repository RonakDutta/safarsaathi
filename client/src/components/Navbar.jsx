import { useState, useContext, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import Logo from "./Logo";

const links = [
  { to: "/services", label: "Services" },
  { to: "/safety", label: "Safety" },
  { to: "/drive", label: "Drive with us" },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const firstName = (user?.full_name || user?.name || "there").split(" ")[0];
  const dashboard =
    user?.role === "admin"
      ? { to: "/admin", label: "Admin panel" }
      : user?.role === "driver"
        ? { to: "/driver", label: "My rides" }
        : null;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/90 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between">
        <Logo />

        {/* Desktop links */}
        <ul className="hidden h-full items-stretch gap-8 md:flex">
          {links.map((link) => (
            <li key={link.to} className="flex">
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `-mb-px flex items-center border-b-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-amber text-white"
                      : "border-transparent text-mute hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop account */}
        <div className="hidden items-center gap-5 md:flex">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-mute">
                Hi, <span className="text-white">{firstName}</span>
              </span>
              {dashboard && (
                <Link to={dashboard.to} className="btn-secondary py-2">
                  {dashboard.label}
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-mute transition-colors hover:text-white"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-fog transition-colors hover:text-white"
              >
                Log in
              </Link>
              <Link to="/signup" className="btn-primary py-2">
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          className="-mr-2 flex h-10 w-10 items-center justify-center text-white md:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-x-0 top-16 bottom-0 flex flex-col overflow-y-auto bg-ink md:hidden"
          onClick={(e) => e.target.closest("a") && setIsMenuOpen(false)}
        >
          <ul className="container-page flex flex-col py-4">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `block border-b border-line py-5 text-2xl font-medium ${
                      isActive ? "text-amber" : "text-white"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="container-page mt-auto flex flex-col gap-3 pb-8">
            {isAuthenticated ? (
              <>
                <p className="mb-2 text-mute">
                  Signed in as <span className="text-white">{firstName}</span>
                </p>
                {dashboard && (
                  <Link to={dashboard.to} className="btn-primary py-3.5">
                    {dashboard.label}
                  </Link>
                )}
                <button onClick={handleLogout} className="btn-secondary py-3.5">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/signup" className="btn-primary py-3.5">
                  Sign up
                </Link>
                <Link to="/login" className="btn-secondary py-3.5">
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
