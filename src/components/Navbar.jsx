function Navbar() {
  return (
    <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-12 py-6">

      <h1 className="text-white text-3xl font-bold">
        EcoTour
      </h1>

      <ul className="hidden md:flex gap-8 text-white font-semibold">
        <li className="cursor-pointer hover:text-yellow-400">Home</li>
        <li className="cursor-pointer hover:text-yellow-400">Destination</li>
        <li className="cursor-pointer hover:text-yellow-400">Plan Trip</li>
        <li className="cursor-pointer hover:text-yellow-400">My Trips</li>
        <li className="cursor-pointer hover:text-yellow-400">Dashboard</li>
      </ul>

      <div className="flex gap-4">
        <button className="bg-green-700 px-6 py-2 rounded-lg text-white">
          Login
        </button>

        <button className="text-white">
          Sign Up
        </button>
      </div>

    </nav>
  );
}

export default Navbar;