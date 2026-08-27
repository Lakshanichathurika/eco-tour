import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `px-3 py-2 rounded-full transition ${
      isActive
        ? "bg-[#2E6B4F] text-white shadow-md"
        : "text-stone-800 hover:bg-[#13884C] hover:text-white"
    }`;

  const mobileNavClass = ({ isActive }) =>
    `block w-full px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-[#2E6B4F] text-white shadow-md"
        : "text-stone-800 hover:bg-[#13884C] hover:text-white"
    }`;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="relative bg-[#D9D9D9] shadow">
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-12 py-5">
        <div className="hidden lg:flex gap-10 mx-auto">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>
          <NavLink to="/destination" className={navClass}>
            Destination
          </NavLink>
          <NavLink to="/plantrip" className={navClass}>
            Plan Trip
          </NavLink>
          <NavLink to="/mytrips" className={navClass}>
            My Trips
          </NavLink>
          <NavLink to="/dashboard" className={navClass}>
            Dashboard
          </NavLink>
        </div>

        <div className="hidden lg:flex gap-5 items-center">
          {user ? (
            <>
              <span className="px-3 py-2 text-stone-800 font-medium">{user.name}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-2 rounded-full transition text-stone-800 hover:bg-[#13884C] hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass}>
                Login
              </NavLink>
              <NavLink to="/signup" className={navClass}>
                Sign Up
              </NavLink>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((o) => !o)}
          className="lg:hidden ml-auto flex items-center justify-center w-11 h-11 rounded-lg text-stone-800 hover:bg-[#13884C] hover:text-white transition"
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 z-40 bg-[#D9D9D9] shadow-lg px-4 pb-4 flex flex-col gap-1">
          <NavLink to="/" className={mobileNavClass} onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/destination" className={mobileNavClass} onClick={closeMenu}>
            Destination
          </NavLink>
          <NavLink to="/plantrip" className={mobileNavClass} onClick={closeMenu}>
            Plan Trip
          </NavLink>
          <NavLink to="/mytrips" className={mobileNavClass} onClick={closeMenu}>
            My Trips
          </NavLink>
          <NavLink to="/dashboard" className={mobileNavClass} onClick={closeMenu}>
            Dashboard
          </NavLink>

          <div className="border-t border-stone-400/40 mt-2 pt-2 flex flex-col gap-1">
            {user ? (
              <>
                <span className="px-4 py-3 text-stone-800 font-medium">{user.name}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 rounded-lg transition text-stone-800 hover:bg-[#13884C] hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={mobileNavClass} onClick={closeMenu}>
                  Login
                </NavLink>
                <NavLink to="/signup" className={mobileNavClass} onClick={closeMenu}>
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
