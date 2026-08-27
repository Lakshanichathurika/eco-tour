import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Profile() {
  return (
    <>
      <Navbar />
      <div className="h-screen flex items-center justify-center text-5xl">
        Profile Page
      </div>
      <Footer />
    </>
  );
}

export default Profile;
