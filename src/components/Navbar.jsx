import { NavLink } from "react-router-dom";

function Navbar() {
  const navClass = ({ isActive }) =>
    `px-3 py-2 rounded-full transition ${
      isActive
        ? "bg-[#2E6B4F] text-white shadow-md"
        : "text-stone-800 hover:bg-white hover:text-[#2E6B4F]"
    }`;

  return (
    <nav className="flex justify-between items-center px-12 py-5 bg-[#D9D9D9] shadow">
      <div className="flex gap-10 mx-auto">
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

      <div className="flex gap-5">
        <NavLink to="/login" className={navClass}>
          Login
        </NavLink>
        <NavLink to="/signup" className={navClass}>
          Sign Up
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;