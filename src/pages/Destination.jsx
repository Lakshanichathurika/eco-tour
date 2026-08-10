import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import destinations from "../data/destinations";
import DestinationCard from "../components/DestinationCard";
import DestinationPopup from "../components/DestinationPopup";

export default function Destination() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("All Provinces");
  const [selectedType, setSelectedType] = useState("All Types");

  const provinces = [
    "All Provinces",
    ...Array.from(new Set(destinations.map((item) => item.location))),
  ];

  const types = [
    "All Types",
    ...Array.from(new Set(destinations.map((item) => item.type || "General"))),
  ];

  const filteredDestinations = destinations.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      item.title.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);
    const matchesProvince =
      selectedProvince === "All Provinces" || item.location === selectedProvince;
    const matchesType =
      selectedType === "All Types" || item.type === selectedType;

    return matchesQuery && matchesProvince && matchesType;
  });

  if (id === undefined) {
    return (
      <>
        <Navbar />
        <section className="bg-stone-50 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <main className="max-w-7xl mx-auto px-6 py-12">
              <h1 className="text-3xl font-bold mb-4">Destinations</h1>
              <p className="text-gray-600">Search and explore our featured destinations.</p>
            </main>

            <div className="mb-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px_240px]">
              <div className="lg:col-span-1">
                <label htmlFor="destination-search" className="sr-only">
                  Search destinations
                </label>
                <input
                  id="destination-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destination"
                  className="w-full rounded-full border border-stone-200 bg-white px-5 py-4 text-lg text-stone-900 shadow-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-200"
                />
              </div>

              <div className="relative">
                <label htmlFor="province-select" className="sr-only">
                  All Provinces
                </label>
                <select
                  id="province-select"
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full rounded-full border border-stone-200 bg-white px-5 py-4 pr-12 text-lg text-stone-900 shadow-sm outline-none appearance-none transition focus:border-green-700 focus:ring-2 focus:ring-green-200"
                >
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-stone-500">
                  <span className="text-lg">⇅</span>
                </div>
              </div>

              <div className="relative">
                <label htmlFor="type-select" className="sr-only">
                  All Types
                </label>
                <select
                  id="type-select"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full rounded-full border border-stone-200 bg-white px-5 py-4 pr-12 text-lg text-stone-900 shadow-sm outline-none appearance-none transition focus:border-green-700 focus:ring-2 focus:ring-green-200"
                >
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-stone-500">
                  <span className="text-lg">⇅</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
              {filteredDestinations.length > 0 ? (
                filteredDestinations.map((item, index) => (
                  <div key={index} className="block">
                    <DestinationCard
                      image={item.image}
                      title={item.title}
                      location={item.location}
                      description={item.description}
                      onClickMain={() => navigate(`/destination/${index}`)}
                      onLearnMore={() => setSelectedDestination(item)}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-stone-600">
                  No destinations match your search.
                </div>
              )}
            </div>
          </div>
        </section>

        <DestinationPopup
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
        />

        <Footer />
      </>
    );
  }

  const destination = destinations[Number(id)];

  if (!destination) {
    return (
      <>
        <Navbar />
        <section className="bg-stone-50 py-24">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-4">Destination not found</h1>
            <p className="text-gray-600">Please choose a valid destination.</p>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="bg-stone-50 py-24">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-6">{destination.title}</h1>
          <img
            src={destination.image}
            alt={destination.title}
            className="w-full h-96 object-cover rounded-2xl mb-8"
          />
          <p className="text-lg text-gray-600 leading-8">{destination.description}</p>
        </div>
      </section>
      <Footer />
    </>
  );
}
