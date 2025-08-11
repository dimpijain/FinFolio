import React, { useState } from "react";
import PortfolioHoldings from "./PortfolioHoldings";



import {
  ChartBarIcon,
  CurrencyDollarIcon,
  BellAlertIcon,
  UserIcon,
  StarIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";
import ThemeToggle from "./ThemeToggle";
import StockSearch from "./StockSearch"; 
import Watchlist from "./Watchlist";
import Alerts from "./Alerts";
// You can create Portfolio, Alerts, Watchlist, Profile components similarly


const Sparkline = () => (
  <svg width="120" height="32" viewBox="0 0 120 32" fill="none">
    <polyline
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      points="0,25 20,20 40,28 60,10 80,16 100,8 120,18"
    />
  </svg>
);

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const user = JSON.parse(localStorage.getItem("user")) || { name: "User", email: "user@example.com" };

  // Your stats array
  const stats = [
    {
      name: "Total Value",
      value: "$48,235.67",
      icon: CurrencyDollarIcon,
      color: "text-green-600 dark:text-green-400",
    },
    {
      name: "Today's Gain",
      value: "+$1,245.33",
      icon: ChartBarIcon,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      name: "1Y ROI",
      value: "12.4%",
      icon: StarIcon,
      color: "text-yellow-500 dark:text-yellow-300",
    },
    {
      name: "Watchlist",
      value: "7 Stocks",
      icon: BellAlertIcon,
      color: "text-indigo-600 dark:text-indigo-400",
    },
  ];

  // Sidebar navigation items
  const navLinks = [
    { key: "dashboard", label: "Dashboard", icon: ChartBarIcon },
    { key: "portfolio", label: "Portfolio", icon: CurrencyRupeeIcon },
    
    { key: "stocksearch", label: "Stock Search", icon: MagnifyingGlassIcon },
    { key: "alerts", label: "Alerts", icon: BellAlertIcon },
    { key: "watchlist", label: "Watchlist", icon: StarIcon },
    
    { key: "profile", label: "Profile", icon: UserIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // Dummy components for other sections
  const Portfolio = () => <PortfolioHoldings userId={user._id} />;

 // const Alerts = () => <div className="text-center text-xl py-20">Alerts Feature Coming Soon</div>;
 
  //const Alerts = () => <div className="text-center text-xl py-20">Alerts Feature Coming Soon</div>;
  // const Watchlist = () => <div className="text-center text-xl py-20">Watchlist Feature Coming Soon</div>;
  const Profile = () => <div className="text-center text-xl py-20">Profile Feature Coming Soon</div>;

  // Main content renderer
  function renderMainContent() {
    switch (activeSection) {
      case "dashboard":
        return (
          <>
            {/* Portfolio Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {stats.map((stat) => (
                <div
                  key={stat.name}
                  className="bg-white dark:bg-[#232d3b] rounded-xl shadow p-5 flex flex-col items-center hover:shadow-2xl transition"
                >
                  <stat.icon className={`w-8 h-8 mb-2 ${stat.color}`} />
                  <div className="text-lg font-bold">{stat.value}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">{stat.name}</div>
                </div>
              ))}
            </div>
            {/* Main Dashboard Widgets */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Portfolio Overview */}
              <div className="col-span-2 bg-white dark:bg-[#232d3b] rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4">
                  Portfolio Performance
                </h2>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-1 text-gray-700 dark:text-gray-200">
                    <div className="mb-2 font-medium">Last 7 days</div>
                    <div className="text-green-600 dark:text-green-300">
                      <Sparkline />
                    </div>
                    <div className="mt-2 font-semibold">+2.5% this week</div>
                  </div>
                  <div className="flex-1 text-gray-700 dark:text-gray-200 text-lg">
                    <ul className="space-y-2">
                      <li>
                        • <span className="font-bold">Top Gainer:</span>{" "}
                        <span className="text-green-700 dark:text-green-300">INFY (+4.2%)</span>
                      </li>
                      <li>
                        • <span className="font-bold">Top Loser:</span>{" "}
                        <span className="text-red-600 dark:text-red-400">TCS (-1.1%)</span>
                      </li>
                      <li>
                        • <span className="font-bold">Asset Mix:</span>{" "}
                        <span className="text-indigo-600 dark:text-indigo-300">Stocks, ETFs, Mutual Funds</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Quick Actions */}
              
              <div className="bg-white dark:bg-[#232d3b] rounded-xl shadow-lg p-8 flex flex-col gap-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Quick Actions</h3>
                
                <button className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition">
                  Add Investment
                </button>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Rebalance Portfolio
                </button>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">
                  Set Alert
                </button>
                <button className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                  View Watchlist
                </button>
              </div>
            </div>
          </>
        );
      case "stocksearch":
        return <StockSearch />;
      case "portfolio":
        return <Portfolio />;
      case "alerts":
        return <Alerts />;
      case "watchlist":
        return <Watchlist />;
      case "profile":
        return <Profile />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-100 to-white dark:from-[#171e2a] dark:to-[#222c3a] font-sans">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-white dark:bg-[#1b2230] shadow-lg py-8 px-2 transition-all duration-200
          ${sidebarCollapsed ? "w-20" : "w-60"}`}
      >
        {/* Logo and Collapse/Expand Button */}
        <div className="flex items-center justify-between mb-8 px-2">
          {!sidebarCollapsed && (
            <span className="flex items-center gap-2">
              <img src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png" alt="logo" className="w-8 h-8" />
              <span className="text-2xl font-bold text-green-700 dark:text-green-400">FinFolio</span>
            </span>
          )}
          <button
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronDoubleRightIcon className="w-6 h-6 text-gray-500" />
            ) : (
              <ChevronDoubleLeftIcon className="w-6 h-6 text-gray-500" />
            )}
          </button>
        </div>
        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navLinks.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full
                ${activeSection === item.key
                  ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-semibold"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"}
                transition`}
            >
              <item.icon className="w-6 h-6" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        {/* Logout at the bottom */}
        <button
          onClick={handleLogout}
          className={`mt-auto flex items-center gap-3 px-3 py-2 rounded-lg w-full
            bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 font-semibold hover:bg-red-200 dark:hover:bg-red-800 transition`}
        >
          <ArrowRightOnRectangleIcon className="w-6 h-6" />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-[#1b2230] shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <img src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png" alt="logo" className="w-8 h-8 md:hidden" />
            <span className="text-2xl font-bold text-green-700 dark:text-green-400 md:hidden">FinFolio</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="hidden md:block text-gray-700 dark:text-gray-200 font-medium">
              Welcome, <span className="text-green-700 dark:text-green-300 font-semibold">{user.name}</span>
            </span>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=22c55e&color=fff`}
              alt="profile"
              className="w-10 h-10 rounded-full border-2 border-green-200 dark:border-green-400"
            />
          </div>
        </header>
        {/* Main Area */}
        <section className="flex-1 px-4 md:px-12 py-8">
          {renderMainContent()}
        </section>
        {/* Footer */}
        <footer className="bg-white dark:bg-[#1b2230] border-t border-gray-200 dark:border-gray-700 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
          FinFolio &copy; 2025.
        </footer>
      </main>
    </div>
  );
}
