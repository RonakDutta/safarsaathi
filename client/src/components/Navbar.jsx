import { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
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

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-amber" : "text-fog/70 hover:text-white"
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-black/90 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between">
        <Logo onClick={closeMenu} />

        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.end} className={linkClass}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-mute">
                Hi, <span className="font-medium text-white">{firstName}</span>
              </span>
              {dashboard && (
                <Link to={dashboard.to} className="btn-primary px-5 py-2">
                  <LayoutDashboard size={16} />
                  {dashboard.label}
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="btn-secondary px-4 py-2"
                aria-label="Log out"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 text-sm font-medium text-fog hover:text-white"
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
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="animate-fade border-t border-white/[0.06] bg-black lg:hidden">
          <div className="container-page py-4">
            {isAuthenticated && (
              <p className="mb-2 text-sm text-mute">
                Signed in as{" "}
                <span className="font-medium text-white">{firstName}</span>
              </p>
            )}
            <ul>
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `block py-3 text-base font-medium ${
                        isActive ? "text-amber" : "text-white"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-2 border-t border-white/[0.06] pt-4">
              {isAuthenticated ? (
                <>
                  {dashboard && (
                    <Link
                      to={dashboard.to}
                      onClick={closeMenu}
                      className="btn-primary"
                    >
                      <LayoutDashboard size={16} />
                      {dashboard.label}
                    </Link>
                  )}
                  <button onClick={handleLogout} className="btn-danger">
                    <LogOut size={16} />
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signup" onClick={closeMenu} className="btn-primary">
                    Sign up
                  </Link>
                  <Link to="/login" onClick={closeMenu} className="btn-secondary">
                    Log in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
