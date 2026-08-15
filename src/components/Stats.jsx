import { Leaf, Mountain, Camera, Heart } from "lucide-react";

const stats = [
  {
    icon: Leaf,
    value: "120+",
    title: "Eco Destinations",
  },
  {
    icon: Mountain,
    value: "50+",
    title: "Nature Trails",
  },
  {
    icon: Camera,
    value: "300+",
    title: "Travel Spots",
  },
  {
    icon: Heart,
    value: "100%",
    title: "Eco Friendly",
  },
];

export default function Stats() {
  return (
    <section className="-mt-17 relative z-20">
      <div className="max-w-7xl mx-auto bg-[#F2F7F4] shadow-lg rounded-lg px-6">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((item, index) => (
            <div key={index} className="py-10 text-center  last:border-r-0">
              <div className="w-16 h-16 rounded-full bg-green-100 mx-auto flex items-center justify-center">
                <item.icon className="text-green-700" size={30} />
              </div>

              <h2 className="text-4xl font-bold mt-6">{item.value}</h2>

              <p className="text-gray-500 mt-2">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
