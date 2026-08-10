import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import WhyChooseUs from "../components/WhyChooseUs";
import Destinations from "../components/Destinations";
import Process from "../components/Process";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <WhyChooseUs />
      <Destinations />
      <Process />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}

export default Home;