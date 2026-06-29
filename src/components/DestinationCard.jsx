import { MapPin } from "lucide-react";

export default function DestinationCard({
  image,
  title,
  location,
  description,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-2 duration-300">

      <img
        src={image}
        alt={title}
        className="w-full h-56 object-cover"
      />

      <div className="p-5">

        <h3 className="text-xl font-bold">
          {title}
        </h3>

        <div className="flex items-center gap-2 text-green-700 text-sm mt-2">

          <MapPin size={16} />

          <span>{location}</span>

        </div>

         {/* Description */}
        <p className="mt-4 text-[14px] leading-6 text-gray-500 flex-grow">
          {description}
        </p>

        <button className="mt-6 text-green-700 font-semibold hover:text-green-900">

          Learn More →

        </button>

      </div>

    </div>
  );
}