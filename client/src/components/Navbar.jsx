import React, { useState, useContext, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  const getFirstName = () => {
    const fullName = user?.full_name || user?.name || "User";
    return fullName.split(" ")[0];
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="bg-[rgba(18,18,18,0.85)] backdrop-blur-md py-4 fixed w-full z-50 border-b border-[#2a2a2a]">
        <nav className="max-w-7xl mx-auto px-5 md:px-8 flex justify-between items-center relative">
          {/* LOGO */}
          <Link
            to={"/"}
            className="text-2xl md:text-3xl font-bold text-white no-underline hover:text-[#ffc107] transition-colors duration-300 z-60"
            onClick={closeMenu}
          >
            Safar<span className="text-[#ffc107]">Saathi</span>
          </Link>

          {/* DESKTOP MENU & MOBILE SLIDE-OUT */}
          <ul
            className={`
              fixed inset-y-0 right-0 h-screen w-3/4 max-w-sm bg-[#121212] md:bg-transparent shadow-2xl md:shadow-none flex flex-col md:flex-row items-center justify-start md:justify-center pt-24 md:pt-0 gap-6 md:gap-8 transition-transform duration-300 ease-in-out z-50
              ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
              md:static md:h-auto md:w-auto md:translate-x-0 md:transform-none list-none m-0
            `}
          >
            {/* Nav Links */}
            <li onClick={closeMenu} className="w-full md:w-auto text-center">
              <NavLink
                to={"/services"}
                className={({ isActive }) =>
                  `block py-2 text-[#e0e0e0] font-medium transition-colors duration-300 hover:text-[#ffc107] text-lg md:text-base ${
                    isActive ? "text-[#ffc107]" : ""
                  }`
                }
              >
                Services
              </NavLink>
            </li>
            <li onClick={closeMenu} className="w-full md:w-auto text-center">
              <NavLink
                to={"/drive"}
                className={({ isActive }) =>
                  `block py-2 text-[#e0e0e0] font-medium transition-colors duration-300 hover:text-[#ffc107] text-lg md:text-base ${
                    isActive ? "text-[#ffc107]" : ""
                  }`
                }
              >
                Drive
              </NavLink>
            </li>
            <li onClick={closeMenu} className="w-full md:w-auto text-center">
              <NavLink
                to={"/safety"}
                className={({ isActive }) =>
                  `block py-2 text-[#e0e0e0] font-medium transition-colors duration-300 hover:text-[#ffc107] text-lg md:text-base ${
                    isActive ? "text-[#ffc107]" : ""
                  }`
                }
              >
                Safety
              </NavLink>
            </li>

            {/* MOBILE AUTH BUTTONS */}
            <li className="md:hidden flex flex-col gap-3 mt-4 w-full px-8 border-t border-[#2a2a2a] pt-8">
              {isAuthenticated ? (
                <>
                  <div className="text-gray-400 text-xs font-bold uppercase tracking-widest text-center mb-2">
                    Account
                  </div>
                  <div className="text-white text-center text-xl font-bold mb-4">
                    Hi, {getFirstName()}
                  </div>

                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={closeMenu}
                      className="w-full text-center px-6 py-3.5 border border-[#ffc107] text-[#ffc107] rounded-xl font-medium active:scale-95 transition-transform"
                    >
                      <i className="fas fa-shield-alt mr-2"></i> Admin Panel
                    </Link>
                  )}
                  {user?.role === "driver" && (
                    <Link
                      to="/driver"
                      onClick={closeMenu}
                      className="w-full text-center px-6 py-3.5 border border-[#ffc107] text-[#ffc107] rounded-xl font-medium active:scale-95 transition-transform"
                    >
                      <i className="fas fa-car mr-2"></i> Driver Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full px-6 py-3.5 mt-2 border border-[#ff4444] text-[#ff4444] rounded-xl font-bold active:scale-95 transition-transform hover:bg-[#ff4444] hover:text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to={"/login"} onClick={closeMenu} className="w-full">
                    <button className="w-full px-6 py-3.5 border border-[#444] text-white rounded-xl font-bold active:scale-95 transition-transform hover:bg-[#222]">
                      Login
                    </button>
                  </Link>
                  <Link to={"/signup"} onClick={closeMenu} className="w-full">
                    <button className="w-full px-6 py-3.5 bg-[#ffc107] text-black rounded-xl font-bold active:scale-95 transition-transform">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </li>
          </ul>

          {/* DESKTOP AUTH BUTTONS */}
          <div className="hidden md:flex gap-4 items-center">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-white font-medium">
                  Hi, {getFirstName()}
                </span>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="text-[#ffc107] inline-block px-5 py-2.5 rounded-full font-medium transition-all duration-300 bg-transparent border border-[#ffc107] hover:bg-[#ffc107] hover:text-black"
                  >
                    <i className="fas fa-shield-alt mr-1"></i> Admin
                  </Link>
                )}
                {user?.role === "driver" && (
                  <Link
                    to="/driver"
                    className="text-[#ffc107] inline-block px-5 py-2.5 rounded-full font-medium transition-all duration-300 bg-transparent border border-[#ffc107] hover:bg-[#ffc107] hover:text-black"
                  >
                    <i className="fas fa-car mr-1"></i> Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 rounded-full font-medium transition-all duration-300 bg-transparent text-[#ff4444] border border-[#ff4444] hover:bg-[#ff4444] hover:text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to={"/login"}>
                  <button className="px-6 py-2.5 rounded-full font-medium transition-all duration-300 bg-transparent text-white border border-[#444] hover:border-white">
                    Login
                  </button>
                </Link>
                <Link to={"/signup"}>
                  <button className="px-6 py-2.5 border-none rounded-full font-medium transition-all duration-300 bg-[#ffc107] text-black hover:bg-[#ffca2c] hover:-translate-y-0.5">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* HAMBURGER BUTTON */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center text-[#ffc107] text-2xl z-60 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <i
              className={`fas transition-transform duration-300 ${isMenuOpen ? "fa-times rotate-90" : "fa-bars"}`}
            ></i>
          </button>
        </nav>
      </header>

      {/* MOBILE OVERLAY BACKDROP */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
          onClick={closeMenu}
        ></div>
      )}
    </>
  );
}

export default Navbar;
