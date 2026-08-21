import DestinationCard from "./DestinationCard";
import { useNavigate, Link } from "react-router-dom";
import { getDestinations } from "../lib/api";
import DestinationPopup from "./DestinationPopup";
import { useState, useEffect } from "react";

export default function Destinations() {
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getDestinations()
      .then(setDestinations)
      .catch(() => setDestinations([]));
  }, []);
  return (
    <section className="bg-stone-50 py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[#2E6B4F] text-sm font-semibold">
              Curated for you
            </p>

            <h2 className="text-[42px] font-bold mt-2">
              Hand-Picked Destinations
            </h2>
          </div>

          <Link
            to="/destination"
            className="text-[#2E6B4F] font-semibold hover:underline flex items-center gap-2"
          >
            View all
            <span>›</span>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {destinations.map((item, index) => (
            <div key={index} className="block">
              <DestinationCard
                image={item.image}
                title={item.title}
                location={item.location}
                description={item.description}
                onClickMain={() => setSelectedDestination(item)}
                onLearnMore={() => setSelectedDestination(item)}
              />
            </div>
          ))}
        </div>
      </div>

      <DestinationPopup
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
      />
    </section>
  );
}
