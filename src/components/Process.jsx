const steps = [
  {
    id: "01",
    title: "Enter Preferences",
    description:
      "Tell us your interests, budget, and how many days you have.",
  },
  {
    id: "02",
    title: "Generates Itinerary",
    description:
      "Our planner builds a responsible route through Sri Lanka's best eco-destinations.",
  },
  {
    id: "03",
    title: "Explore Responsibly",
    description:
      "Follow your itinerary with confidence, knowing every stop supports conservation.",
  },
];

export default function Process() {
  return (
    <section className="bg-[#F7FBF8] pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-8">

        {/* Heading */}
        <div className="text-center">
          <p className="text-[#2E6B4F] text-sm font-semibold">
            Simple Process
          </p>

          <h2 className="text-[42px] font-bold mt-2">
            How It Work
          </h2>

          <p className="text-gray-500 text-sm mt-4">
            Three simple steps to your perfectly planned eco-adventure.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mt-24">

          {/* Center Line */}
          <div className="hidden md:block absolute top-6 left-[110px] right-[110px] h-[1.5px] bg-gray-300"></div>

          <div className="flex justify-between relative z-10">

            {steps.map((step) => (
              <div
                key={step.id}
                className="w-[260px] flex flex-col items-center text-center"
              >
                {/* Circle */}
                <div className="w-14 h-14 rounded-full bg-[#E5E7EB] flex items-center justify-center text-sm font-bold shadow-sm">
                  {step.id}
                </div>

                {/* Title */}
                <h3 className="mt-8 text-[22px] font-bold">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-[15px] leading-6 text-gray-500">
                  {step.description}
                </p>
              </div>
            ))}

          </div>

        </div>
      </div>
    </section>
  );
}