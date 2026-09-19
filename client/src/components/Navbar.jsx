import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const closeMenu = () => setIsMenuOpen(false);
  const firstName = (user?.full_name || user?.name || "User").split(" ")[0];

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  const navClass = ({ isActive }) =>
    `nav-link ${isActive ? "nav-link-active" : ""}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="brand" onClick={closeMenu} aria-label="SafarSaathi home">
          Safar<span>Saathi</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/services" className={navClass}>Services</NavLink>
          <NavLink to="/safety" className={navClass}>Safety</NavLink>
          <NavLink to="/drive" className={navClass}>Drive with us</NavLink>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span className="text-sm font-medium text-slate-600">Hello, {firstName}</span>
              {user?.role === "admin" && <Link to="/admin" className="text-button">Admin</Link>}
              {user?.role === "driver" && <Link to="/driver" className="text-button">Dashboard</Link>}
              <button onClick={handleLogout} className="text-button text-rose-600">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-button">Log in</Link>
              <Link to="/signup" className="button-primary">Create account</Link>
            </>
          )}
        </div>

        <button className="grid h-10 w-10 place-items-center text-xl text-slate-900 md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle navigation" aria-expanded={isMenuOpen}>
          <i className={`fas ${isMenuOpen ? "fa-xmark" : "fa-bars"}`} />
        </button>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-5 pb-6 pt-3 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col">
            <NavLink to="/services" onClick={closeMenu} className={navClass}>Services</NavLink>
            <NavLink to="/safety" onClick={closeMenu} className={navClass}>Safety</NavLink>
            <NavLink to="/drive" onClick={closeMenu} className={navClass}>Drive with us</NavLink>
            <div className="mt-4 flex gap-3 border-t border-slate-200 pt-4">
              {isAuthenticated ? <button onClick={handleLogout} className="text-button text-rose-600">Log out</button> : <><Link to="/login" onClick={closeMenu} className="text-button">Log in</Link><Link to="/signup" onClick={closeMenu} className="button-primary">Create account</Link></>}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
