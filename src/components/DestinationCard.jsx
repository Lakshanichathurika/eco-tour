import React from "react";
import { MapPin } from "lucide-react";

export default function DestinationCard({ image, title, location, description, onLearnMore, onClickMain }) {
  const handleKey = (e) => {
    if (e.key === "Enter" && onClickMain) onClickMain();
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-2 duration-300 flex flex-col h-full">

      <div role="link" tabIndex={0} onClick={onClickMain} onKeyDown={handleKey} className="cursor-pointer">
        <img src={image} alt={title} className="w-full h-64 object-cover" />
      </div>

      <div className="p-6 flex flex-col flex-1">

        <h3 className="text-2xl font-bold cursor-pointer" onClick={onClickMain} onKeyDown={handleKey} tabIndex={0} role="link">{title}</h3>

        <div className="flex items-center gap-2 text-green-700 mt-3">
          <MapPin size={18} />
          <span>{location}</span>
        </div>

        <p className="mt-5 text-gray-500 leading-8 flex-grow">{description}</p>

        <button
  onClick={onLearnMore}
  className="mt-auto pt-6 text-green-700 font-semibold hover:text-green-900"
>
  Learn More →
</button>

      </div>

    </div>
  );
}