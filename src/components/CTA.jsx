import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CTA() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartPlanning = () => {
    if (user) {
      navigate("/plantrip");
    } else {
      navigate("/signup");
    }
  };

  return (
    <section className="bg-[#F7FBF8] pt-12 pb-12 sm:pt-24 sm:pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-[#1F6A38] rounded-3xl py-10 px-5 sm:py-16 sm:px-10 text-center shadow-lg">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Ready to explore responsibly?
          </h2>

          <p className="text-green-100 text-lg mt-5">
            Build your custom Sri Lanka itinerary in under
            <span className="font-semibold"> 2 minutes </span>— completely free.
          </p>

          <button
            onClick={handleStartPlanning}
            className="mt-10 inline-flex items-center gap-3 bg-white text-gray-900 px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold shadow hover:scale-105 duration-300"
          >
            Starting Planning Free
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
