import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroImg from "../assets/hero.jpg";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { signup as signupRequest, login as loginRequest } from "../lib/api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await signupRequest({ name, email, password });
      // Signup doesn't return a token — log the user straight in with the
      // same credentials rather than asking them to log in a second time.
      const { token, user } = await loginRequest({ email, password });
      login(token, user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImg})` }}
    >
      <div className="min-h-screen bg-black/60">
        <Navbar />

        <div className="flex items-center justify-center px-5 py-16">
          <div className="w-full max-w-md bg-black/40 backdrop-blur-md border border-white/20 rounded-3xl p-10">
            <h1 className="text-white text-4xl font-serif text-center mb-8">
              Create Your Account
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-200 mb-2" htmlFor="signup-name">
                  Name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-full border border-white/30 bg-white/10 px-5 py-3 text-white placeholder-gray-300 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/40"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-gray-200 mb-2" htmlFor="signup-email">
                  Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-full border border-white/30 bg-white/10 px-5 py-3 text-white placeholder-gray-300 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/40"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-200 mb-2" htmlFor="signup-password">
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-full border border-white/30 bg-white/10 px-5 py-3 text-white placeholder-gray-300 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/40"
                  placeholder="At least 8 characters"
                />
              </div>

              <div>
                <label className="block text-gray-200 mb-2" htmlFor="signup-confirm">
                  Confirm password
                </label>
                <input
                  id="signup-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-full border border-white/30 bg-white/10 px-5 py-3 text-white placeholder-gray-300 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/40"
                  placeholder="••••••••"
                />
              </div>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-full text-lg font-semibold transition disabled:opacity-50"
              >
                {submitting ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            <p className="text-gray-300 text-center mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-yellow-400 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
