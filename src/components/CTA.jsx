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
    <section className="bg-[#F7FBF8] pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-[#1F6A38] rounded-3xl py-16 px-10 text-center shadow-lg">
          <h2 className="text-5xl font-bold text-white">
            Ready to explore responsibly?
          </h2>

          <p className="text-green-100 text-lg mt-5">
            Build your custom Sri Lanka itinerary in under
            <span className="font-semibold"> 2 minutes </span>— completely free.
          </p>

          <button
            onClick={handleStartPlanning}
            className="mt-10 inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold shadow hover:scale-105 duration-300"
          >
            Starting Planning Free
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
