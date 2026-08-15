import { User } from "lucide-react";

const testimonials = [
  {
    name: "Jason Smith",
    country: "France",
    review:
      "From misty mountains to sunny beaches, explore the island's beauty with our exclusive tour packages designed for every traveler.",
  },
  {
    name: "Jason Smith",
    country: "France",
    review:
      "From misty mountains to sunny beaches, explore the island's beauty with our exclusive tour packages designed for every traveler.",
  },
  {
    name: "Jason Smith",
    country: "France",
    review:
      "From misty mountains to sunny beaches, explore the island's beauty with our exclusive tour packages designed for every traveler.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[0C512D] pt-5 pb-28">
      {/* Background Strip */}
      <div className="w-full h-24 bg-[0C512D]"></div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}

        <div className="text-center">
          <p className="text-[#2E6B4F] font-semibold text-sm">
            Traveler Stories
          </p>

          <h2 className="text-5xl font-bold mt-3">Love by mindful explorers</h2>
        </div>

        {/* Cards */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-20">
          {testimonials.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Review Box */}

              <div className="bg-white rounded-xl shadow-lg px-8 py-8 h-40 flex items-center justify-center text-center">
                <p className="text-gray-500 text-sm leading-7">{item.review}</p>
              </div>

              {/* Avatar */}

              <div className="-mt-8">
                <div className="w-16 h-16 rounded-full bg-green-700 flex items-center justify-center text-white border-4 border-[#F7FBF8]">
                  <User size={28} />
                </div>
              </div>

              {/* Rating */}

              <div className="flex gap-1 mt-3">
                <span className="w-2 h-2 rounded-full bg-green-600"></span>
                <span className="w-2 h-2 rounded-full bg-green-600"></span>
                <span className="w-2 h-2 rounded-full bg-green-600"></span>
                <span className="w-2 h-2 rounded-full bg-green-600"></span>
              </div>

              {/* Name */}

              <h3 className="mt-4 font-bold text-xl">{item.name}</h3>

              <p className="text-gray-500">{item.country}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
