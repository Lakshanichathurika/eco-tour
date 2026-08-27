import { FaTimes } from "react-icons/fa";
import {
  MapPin,
  Star,
  Camera,
  ShieldCheck,
  BedDouble,
  CarFront,
} from "lucide-react";

export default function DestinationPopup({ destination, onClose }) {
  if (!destination) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/35">
      <div className="ml-auto flex h-full w-full max-w-[760px] flex-col bg-[#f5f3f0] shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4 text-sm text-stone-700">
           
           
          </div>

          <button
          
            type="button"
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#13884C]  shadow-sm transition hover:bg-[#255b42]"
            aria-label="Close destination detail "
          >
            <FaTimes  className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-8">
          <div className="rounded-[26px] bg-[#f7f7f5] p-6 shadow-inner">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1f2d2a]">
              {destination.title}
            </h2>

            <div className="mt-5 overflow-hidden rounded-[18px]">
              <img
                src={destination.image}
                alt={destination.title}
                className="h-48 sm:h-[260px] w-full object-cover"
              />
            </div>

            <div className="mt-5 flex justify-center gap-1 text-xl text-[#d9a252]">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} size={18} fill="currentColor" />
              ))}
            </div>

            <div className="mt-7 space-y-5 text-stone-700">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-md bg-[#f0e8d2] text-[#7a5d28]">
                  <Camera size={18} />
                </div>
                <div>
                  <p className="text-xl font-semibold text-[#1f2d2a]">Best Section</p>
                  <p className="text-sm text-stone-500">
                    January — March (clearest views)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-md bg-[#f0e8d2] text-[#7a5d28]">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-xl font-semibold text-[#1f2d2a]">Conservation Notes</p>
                  <p className="text-sm text-stone-600 leading-6">
                    Please stay on marked paths. Avoid disturbing wildlife and keep a
                    respectful distance from sensitive habitats.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-md bg-[#f0e8d2] text-[#7a5d28]">
                  <BedDouble size={18} />
                </div>
                <div>
                  <p className="text-xl font-semibold text-[#1f2d2a]">Nearby Eco-Lodges</p>
                  <ul className="mt-1 list-disc pl-5 text-sm text-stone-600">
                    <li>Farm Inn</li>
                    <li>King’s Pavilion</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-md bg-[#f0e8d2] text-[#7a5d28]">
                  <CarFront size={18} />
                </div>
                <div>
                  <p className="text-xl font-semibold text-[#1f2d2a]">Nearby Eco-Lodges</p>
                  <ul className="mt-1 list-disc pl-5 text-sm text-stone-600">
                    <li>Train to Nanu Oya</li>
                    <li>Bus from Nuwara Eliya</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-4 text-xl font-semibold text-[#1f2d2a]">Activities</p>
              <div className="flex flex-wrap gap-3">
                {[
                  "Hiking the world",
                  "Visit Elephant Transmit",
                  "Bird watching",
                  "Reservoir walks",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#eadab2] px-4 py-2 text-sm font-medium text-[#4b3a18]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-7 text-base leading-7 text-stone-700">
              {destination.title} National Park is a protected area in the central
              highlands, characterized by montane grasslands and cloud forests. The
              park’s most famous feature is World’s End, a sheer precipice with an
              880-meter drop. The ecosystem supports several endemic species,
              including the Sri Lankan sambhar deer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
