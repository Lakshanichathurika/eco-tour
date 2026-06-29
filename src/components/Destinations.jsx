import DestinationCard from "./DestinationCard";

import sigiriya from "../assets/sigiriya.jpg";
import ella from "../assets/ella.jpg";
import yala from "../assets/yala.jpg";
import sinharaja from "../assets/sinharaja.jpg";


const destinations = [
  {
    title: "Sinharaja Forest",
    location: "Sabaragamuwa",
    image: sigiriya,
    description:
      "Explore the iconic Lion Rock, ancient frescoes, and breathtaking panoramic views.",
  },
  {
    title: "Knuckles",
    location: "Kandy",
    image: ella,
    description:
      "Explore the iconic Lion Rock, ancient frescoes, and breathtaking panoramic views.",
  },
  {
    title: "Ella",
    location: "Badulla",
    image: yala,
    description:
      "Explore the iconic Lion Rock, ancient frescoes, and breathtaking panoramic views.",
  },
  {
    title: "Horton Plains",
    location: "Nuwara Eliya",
    image: sinharaja,
    description:
      "Explore the iconic Lion Rock, ancient frescoes, and breathtaking panoramic views.",
  },
  {
    title: "Nilaveli Beach",
    location: "Trincomalee",
    image: sigiriya,
    description:
      "Explore the iconic Lion Rock, ancient frescoes, and breathtaking panoramic views.",
  },
  {
    title: "Temple of Tooth",
    location: "Kandy",
    image: ella,
    description:"Explore the iconic Lion Rock, ancient frescoes, and breathtaking panoramic views.",
  },
  {
    title: "Sinharaja Rainforest",
    location: "Ratnapura",
    image: sinharaja,
    description:
      "Explore the iconic Lion Rock, ancient frescoes, and breathtaking panoramic views.",
  },
  {
    title: "Pidurangala",
    location: "Sigiriya",
    image: sigiriya,
    description:
      "Explore the iconic Lion Rock, ancient frescoes, and breathtaking panoramic views.",
  },
];

export default function Destinations() {
  return (
    <section className="bg-stone-50 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-14"></div>

        {/* Heading */}
        <div className="flex items-end justify-between mb-12">

          <div>
            <p className="text-[#2E6B4F] text-sm font-semibold">
              Curated for you
            </p>

            <h2 className="text-[42px] font-bold mt-2">
              Hand-Picked Destination
            </h2>
          </div>

          <button className="text-[#2E6B4F] font-semibold hover:underline flex items-center gap-2">
            View all
            <span>›</span>
          </button>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">

          {destinations.map((item, index) => (
            <DestinationCard
              key={index}
              image={item.image}
              title={item.title}
              location={item.location}
               description={item.description}
            />
          ))}

        </div>

      </div>
    </section>
  );
}