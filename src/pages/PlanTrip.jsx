import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function PlanTrip() {
  return (
    <>
      <Navbar />
      <section className="bg-stone-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <main className="max-w-7xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-4">Plan Your Trip</h1>
            <p className="text-gray-600">
              Plan your next adventure with our trip planning tool.
            </p>
          </main>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default PlanTrip;
