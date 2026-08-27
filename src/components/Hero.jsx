import { useNavigate } from "react-router-dom";
import hero from "../assets/hero.jpg";
import { useAuth } from "../context/AuthContext";

function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePlanTrip = () => {
    if (user) {
      navigate("/plantrip");
    } else {
      navigate("/login", { state: { message: "Please login to plan your trip." } });
    }
  };

  return (
    <section
      className="h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${hero})`,
      }}
    >
      <div className="w-full h-full bg-black/40 flex flex-col justify-center items-center text-center px-5">
        <h1 className="text-white text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif leading-tight">
          Plane Your Eco Journey
          <br />
          In Sri Lanka
        </h1>

        <p className="text-gray-200 mt-8 max-w-4xl text-base sm:text-lg md:text-xl leading-9">
          Discover Sri Lanka's heritage, hills, and beaches in one journey—from
          Sigiriya's ancient wonders to Kandy's culture, Ella's tea hills,
          Yala's wildlife, and Galle's coast.
        </p>

        <div className="mt-12 flex gap-6 flex-wrap justify-center">
          <button
            onClick={handlePlanTrip}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 sm:px-8 sm:py-4 rounded-full text-lg font-semibold"
          >
            Plane My Trip →
          </button>

          <button
            onClick={() => navigate("/destination")}
            className="bg-white/20 backdrop-blur-md border border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-lg"
          >
            Explore Destinations
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
