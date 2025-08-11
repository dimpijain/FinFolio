import React, { useState } from "react";
import {
  ChartBarIcon,
  UserIcon,
  ShieldCheckIcon,
  BellAlertIcon,
  AdjustmentsVerticalIcon,
  ChartPieIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

// Demo sparkline chart SVG (replace with a real chart if you wish)
const Sparkline = () => (
  <svg width="120" height="32" viewBox="0 0 120 32" fill="none">
    <polyline
      fill="none"
      stroke="#22c55e"
      strokeWidth="3"
      points="0,25 20,20 40,28 60,10 80,16 100,8 120,18"
    />
  </svg>
);

const features = [
  {
    name: "Real-Time Market Data",
    description: "Live prices and instant updates for stocks and funds.",
    icon: ChartBarIcon,
  },
  {
    name: "Secure & Private",
    description: "Encrypted, privacy-first portfolio storage.",
    icon: ShieldCheckIcon,
  },
  {
    name: "Personalized Alerts",
    description: "Custom notifications for price changes and news.",
    icon: BellAlertIcon,
  },
  {
    name: "Smart Rebalancing",
    description: "Automated suggestions to keep your portfolio on track.",
    icon: AdjustmentsVerticalIcon,
  },
  {
    name: "Visual Analytics",
    description: "Beautiful charts and ROI breakdowns for every asset.",
    icon: ChartPieIcon,
  },
  {
    name: "Watchlist & Tracking",
    description: "Follow your favorite stocks and get instant updates.",
    icon: UserIcon,
  },
  {
    name: "Profit/Loss Insights",
    description: "Clear, actionable performance analytics.",
    icon: CurrencyDollarIcon,
  },
];

function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setModalTab("login");
        setForm({ name: "", email: form.email, password: "" }); // Keep email for convenience
        setSuccessMsg("Signup successful! Please log in.");
      } else {
        setError(data.error || "Signup failed.");
      }
    } catch {
      setError("Server error. Please try again.");
    }
    setLoading(false);
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user._id);
        setModalOpen(false);
        window.location.href = "/dashboard"; // Change if you use React Router
      } else {
        setError(data.error || "Login failed.");
      }
    } catch {
      setError("Server error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-white min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png"
            alt="logo"
            className="w-8 h-8"
          />
          <span className="text-2xl font-bold text-green-700 tracking-tight">
            FinFolio
          </span>
        </div>
        <div className="hidden md:flex gap-8 text-gray-700 font-medium">
          <a href="#features" className="hover:text-green-700 transition">
            Features
          </a>
          <a href="#dashboard" className="hover:text-green-700 transition">
            Dashboard
          </a>
          <a href="#learn" className="hover:text-green-700 transition">
            Learn
          </a>
        </div>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 rounded-md font-semibold  text-white bg-green-600 hover:bg-green-700 transition"
            onClick={() => {
              setModalOpen(true);
              setModalTab("login");
              setError("");
              setSuccessMsg("");
              setForm({ name: "", email: "", password: "" });
            }}
            aria-label="Login"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-20 max-w-6xl mx-auto w-full relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <linearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#bbf7d0" />
                <stop offset="100%" stopColor="#f0fdf4" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#bgGradient)" />
            <polyline
              points="0,80 100,60 200,90 300,40 400,70 500,30 600,60"
              stroke="#22c55e"
              strokeWidth="6"
              fill="none"
              opacity="0.2"
            />
          </svg>
        </div>
        <div className="md:w-1/2 space-y-6 z-10">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Invest. Track. <span className="text-green-700">Grow.</span>
          </h1>
          <p className="text-xl text-gray-700">
            Your all-in-one platform for smart investing. Analyze your portfolio, get real-time updates, and achieve your financial goals with ease.
          </p>
          <div className="flex gap-4 mt-6">
            <button
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              onClick={() => {
                setModalOpen(true);
                setModalTab("signup");
                setError("");
                setSuccessMsg("");
                setForm({ name: "", email: "", password: "" });
              }}
            >
              Get Started
            </button>
            <button
              className="border border-green-600 text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
              onClick={() =>
                window.scrollTo({
                  top: document.getElementById("features").offsetTop - 60,
                  behavior: "smooth",
                })
              }
            >
              See Features
            </button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center mt-12 md:mt-0 z-10">
          <img
            src="https://plus.unsplash.com/premium_photo-1661700152890-931fb04588e6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Dashboard preview"
            className="w-full max-w-md rounded-xl shadow-lg"
            loading="lazy"
          />
        </div>
      </section>

      {/* Features Grid */}
      <section
        id="features"
        className="py-16 px-8 bg-gradient-to-r from-green-50 to-white"
      >
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-10 text-center">
            Key Features
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center hover:shadow-2xl hover:scale-105 transition-transform duration-200 group"
              >
                <feature.icon className="h-10 w-10 text-green-600 mb-4 group-hover:text-green-700 transition" />
                <h4 className="text-lg font-semibold mb-2">{feature.name}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section id="dashboard" className="bg-white py-16 px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-4 text-gray-900">
              Your Portfolio at a Glance
            </h3>
            <ul className="space-y-4 text-lg text-gray-700">
              <li>
                • Total Value:{" "}
                <span className="font-bold text-green-700">$48,235.67</span>
              </li>
              <li>
                • Today's Gain/Loss:{" "}
                <span className="font-bold text-green-600">
                  + $1,245.33
                </span>
              </li>
              <li>
                • Asset Allocation:{" "}
                <span className="font-bold text-indigo-600">
                  Stocks, ETFs, Mutual Funds
                </span>
              </li>
              <li>
                • ROI:{" "}
                <span className="font-bold text-blue-600">12.4% (1Y)</span>
              </li>
            </ul>
            <p className="mt-6 text-gray-500">
              Visualize your performance with interactive charts and get actionable insights at a glance.
            </p>
            {/* Animated sparkline */}
            <div className="mt-4">
              <Sparkline />
              <span className="text-green-700 text-sm ml-2 font-semibold">
                +2.5% today
              </span>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="https://plus.unsplash.com/premium_photo-1676673189412-56a98d221c11?q=80&w=725&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Portfolio charts"
              className="w-full max-w-md rounded-xl shadow-xl"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Educational Section */}
      <section
        id="learn"
        className="bg-gradient-to-r from-green-100 to-white py-16 px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Learn & Grow
          </h2>
          <p className="text-lg text-gray-600">
            New to investing? Explore our interactive guides, risk profiling tools, and educational resources to become a smarter investor.
          </p>
        </div>
      </section>

      {/* Trust & Testimonials */}
      <section className="bg-white py-10 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Trusted by thousands of investors
          </h3>
          <p className="text-gray-500 mb-4">
            “FinFolio helped me understand my investments and make better decisions. The UI is beautiful and easy to use!”
          </p>
          <div className="flex gap-4 justify-center">
            <div className="flex flex-col items-center">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="user"
                className="w-10 h-10 rounded-full"
              />
              <span className="text-xs text-gray-600 mt-1">Amit, Mumbai</span>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="user"
                className="w-10 h-10 rounded-full"
              />
              <span className="text-xs text-gray-600 mt-1">Priya, Bengaluru</span>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="https://randomuser.me/api/portraits/men/54.jpg"
                alt="user"
                className="w-10 h-10 rounded-full"
              />
              <span className="text-xs text-gray-600 mt-1">Rahul, Delhi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-10 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-8">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-green-600 text-xl">FinFolio</span>
            <span className="ml-2 text-gray-400">© 2025</span>
          </div>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-green-500">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-green-500">
              Terms
            </a>
            <a href="#contact" className="hover:text-green-500">
              Contact
            </a>
            {/* Social icons */}
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-green-500"
            >
              <svg
                className="w-5 h-5 inline ml-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724c-.951.564-2.005.974-3.127 1.195A4.916 4.916 0 0016.616 3c-2.72 0-4.924 2.206-4.924 4.924 0 .386.044.762.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.215 2.188 4.099a4.904 4.904 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89A4.936 4.936 0 012 18.13a9.868 9.868 0 005.34 1.566" />
              </svg>
            </a>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-green-500"
            >
              <svg
                className="w-5 h-5 inline ml-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.304.762-1.604-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.382 1.236-3.222-.124-.304-.535-1.527.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 013.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.654 1.649.243 2.872.12 3.176.77.84 1.235 1.912 1.235 3.222 0 4.609-2.803 5.624-5.475 5.921.43.371.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>

      {/* Login/Signup Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md">
            <div className="flex justify-between mb-6">
              <button
                className={`font-semibold px-4 py-2 rounded ${
                  modalTab === "login"
                    ? "bg-green-100 text-green-700"
                    : "text-gray-500"
                }`}
                onClick={() => {
                  setModalTab("login");
                  setError("");
                  setSuccessMsg("");
                }}
              >
                Login
              </button>
              <button
                className={`font-semibold px-4 py-2 rounded ${
                  modalTab === "signup"
                    ? "bg-green-100 text-green-700"
                    : "text-gray-500"
                }`}
                onClick={() => {
                  setModalTab("signup");
                  setError("");
                  setSuccessMsg("");
                }}
              >
                Sign Up
              </button>
              <button
                className="ml-auto text-gray-400 hover:text-gray-700"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            {modalTab === "login" ? (
              <form className="space-y-4" onSubmit={handleLogin}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-200"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-200"
                />
                <button
                  className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
                {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
                {successMsg && <p className="text-green-700 mt-2 text-center">{successMsg}</p>}
                <p className="text-sm text-center text-gray-500 mt-2">
                  New to FinFolio?{" "}
                  <span
                    className="text-green-700 cursor-pointer"
                    onClick={() => {
                      setModalTab("signup");
                      setError("");
                      setSuccessMsg("");
                    }}
                  >
                    Create an account
                  </span>
                </p>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={handleSignup}>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  minLength={3}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-200"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-200"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-200"
                />
                <button
                  className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition"
                  disabled={loading}
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </button>
                {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
                {successMsg && <p className="text-green-700 mt-2 text-center">{successMsg}</p>}
                <p className="text-sm text-center text-gray-500 mt-2">
                  Already have an account?{" "}
                  <span
                    className="text-green-700 cursor-pointer"
                    onClick={() => {
                      setModalTab("login");
                      setError("");
                      setSuccessMsg("");
                    }}
                  >
                    Login
                  </span>
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
