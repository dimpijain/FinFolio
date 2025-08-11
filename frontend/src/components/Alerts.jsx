import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(import.meta.env.VITE_RAPIDAPI_HOST, import.meta.env.VITE_RAPIDAPI_KEY);


  const fetchTrendingStocks = async () => {
    const url = `https://${import.meta.env.VITE_RAPIDAPI_HOST}/market/v2/get-movers?region=US&lang=en`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
          'X-RapidAPI-Host': import.meta.env.VITE_RAPIDAPI_HOST,
        },
      });

      const data = await response.json();
      const movers = data?.finance?.result?.flatMap(section => section.quotes || []) || [];
      setAlerts(movers);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingStocks();
    const interval = setInterval(fetchTrendingStocks, 60000); // update every 60 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen text-white pt-2 px-6 pb-6">
      <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-2">
        <h1 className="text-xl font-normal text-yellow-400 tracking-tight">🔔 Stock Alerts</h1>
        <span className="text-sm text-gray-400">Latest movements based on price changes</span>
      </div>

      {loading ? (
        <div className="text-center mt-32 text-gray-400 text-xl">
          Loading stock alerts...
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center mt-32 text-gray-400 text-xl">
          No significant price movements at the moment.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg shadow-md border relative ${
                alert.regularMarketChange >= 0
                  ? 'bg-green-50 text-black dark:bg-gray-800 dark:text-white border-green-300 dark:border-green-500'
                  : 'bg-red-50 text-black dark:bg-gray-800 dark:text-white border-red-300 dark:border-red-500'
              }`}
            >
              <div className="absolute top-3 right-3">
                {alert.regularMarketChange >= 0 ? (
                  <TrendingUp className="text-green-500" />
                ) : (
                  <TrendingDown className="text-red-500" />
                )}
              </div>
              <h3 className="text-xl font-bold">{alert.symbol}</h3>
              <p className="text-gray-600 dark:text-gray-300">{alert.shortName}</p>
              <p className="mt-2 text-lg font-semibold">
                ${alert.regularMarketPrice?.toFixed(2) || '—'}
              </p>
              <p
                className={`mt-1 ${
                  alert.regularMarketChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {alert.regularMarketChange >= 0 ? '+' : ''}
                {alert.regularMarketChange?.toFixed(2)} (
                {alert.regularMarketChangePercent?.toFixed(2)}%)
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;
