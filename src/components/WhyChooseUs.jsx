import about from "../assets/about.png";

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left Image */}
          <div>
            <img
              src={about}
              alt="About"
              className="w-full h-64 sm:h-80 md:h-[500px] object-cover"
            />
          </div>

          {/* Right */}
          <div className="pt-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10">
              Why You Choose Us
            </h2>

            <div className="bg-[#EEF5F2] p-6 sm:p-10 min-h-[390px] rounded-lg shadow-lg ">
              <p className="text-gray-600 leading-8 text-lg text-justify">
                Discover Sri Lanka like never before with our exclusive travel
                packages. Whether you're looking for a scenic road trip through
                the hill country, a beach getaway, or a cultural city tour, our
                knowledge-based itinerary planner helps you discover the perfect
                eco destinations while keeping your journey sustainable.
              </p>

              <div className="my-10"></div>

              <p className="text-gray-600 leading-8 text-lg text-justify">
                Plan smarter with personalized recommendations based on your
                interests, budget, travel duration and preferred activities.
                Experience nature responsibly while supporting local communities
                and protecting Sri Lanka's biodiversity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
