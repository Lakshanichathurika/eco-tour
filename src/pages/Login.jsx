import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import heroImg from "../assets/hero.jpg";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { login as loginRequest } from "../lib/api";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const redirectMessage = location.state?.message;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setSubmitting(true);
    try {
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

        <div className="flex items-center justify-center px-4 py-12 sm:py-20">
          <div className="w-full max-w-md bg-black/40 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-10">
            <h1 className="text-white text-3xl sm:text-4xl font-serif text-center mb-8">
              Welcome Back
            </h1>

            {redirectMessage && (
              <p className="text-yellow-300 text-sm text-center mb-6 bg-yellow-400/10 border border-yellow-400/30 rounded-xl py-2 px-4">
                {redirectMessage}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-200 mb-2" htmlFor="login-email">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-full border border-white/30 bg-white/10 px-5 py-3 text-white placeholder-gray-300 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/40"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-200 mb-2" htmlFor="login-password">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                {submitting ? "Logging in..." : "Log In"}
              </button>
            </form>

            <p className="text-gray-300 text-center mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="text-yellow-400 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
