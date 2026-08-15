import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#DDEAE3] pt-16">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-20 ">
          {/* Left */}

          <div>
            <h2 className="text-3xl font-bold text-[#2E6B4F]">EcoRoute</h2>

            <p className="text-gray-700 mt-5 leading-7">
              Smart, sustainable journeys across Sri Lanka — designed by
              knowledge, guided by nature.
            </p>
          </div>

          {/* Quick Links */}

          <div>
            <h3 className="font-bold text-2xl mb-6">Quick Links</h3>

            <ul className="space-y-3 text-gray-700">
              <li className="hover:text-green-700 cursor-pointer">Home</li>

              <li className="hover:text-green-700 cursor-pointer">
                Destination
              </li>

              <li className="hover:text-green-700 cursor-pointer">Plan Trip</li>

              <li className="hover:text-green-700 cursor-pointer">My Trip</li>

              <li className="hover:text-green-700 cursor-pointer">Dashboard</li>
            </ul>
          </div>

          {/* Contact */}

          <div>
            <h3 className="font-bold text-2xl mb-6">Contact</h3>

            <ul className="space-y-3 text-gray-700">
              <li>hello@ecoroute.lk</li>

              <li>Colombo, Sri Lanka</li>

              <li>+94 71 234 5678</li>
            </ul>

            <div className="flex gap-5 mt-8">
              <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center hover:bg-green-700 cursor-pointer transition">
                <FaFacebookF size={18} />
              </div>

              <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center hover:bg-green-700 cursor-pointer transition">
                <FaInstagram size={18} />
              </div>

              <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center hover:bg-green-700 cursor-pointer transition">
                <FaWhatsapp size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}

      <div className="border-t border-gray-400 mt-14">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            © 2026 EcoRoute Sri Lanka. Travel responsibly.
          </p>

          <div className="flex gap-8 mt-4 md:mt-0">
            <button className="text-sm text-gray-600 hover:text-green-700">
              Privacy Policy
            </button>

            <button className="text-sm text-gray-600 hover:text-green-700">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
