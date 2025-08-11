import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, TrendingUp, TrendingDown, X, Bell } from 'lucide-react';

const STOCK_API_KEY = import.meta.env.VITE_STOCK_API_KEY;
const DEMO_API_KEY = import.meta.env.VITE_STOCK_API_KEY_DEMO || "demo";
const STOCK_API_URL = 'https://www.alphavantage.co/query';

const isDemoKey = !STOCK_API_KEY || STOCK_API_KEY === "demo";

// Helper function to fetch with fallback to demo key
async function fetchAlphaVantage(url, fallbackUrl) {
  let res = await fetch(url);
  let data;
  try {
    data = await res.json();
  } catch {
    // If response is not JSON, treat as error
    data = {};
  }

  // Check for rate limit in Note, Information, or if data is a string message
  const rateLimitHit =
    (typeof data === "object" && (data['Note'] || data['Information'])) ||
    (typeof data === "string" &&
      (data.includes("rate limit") || data.includes("API key")));

  if (rateLimitHit && fallbackUrl) {
    res = await fetch(fallbackUrl);
    try {
      data = await res.json();
    } catch {
      data = {};
    }
  }
  return data;
}

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newStock, setNewStock] = useState({ symbol: '', name: '' });
  const [filter, setFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const intervalRef = useRef(null);
  const [showAlerts, setShowAlerts] = useState(false);

  const token = localStorage.getItem('token');
  if (!token) {
    return <div className="text-red-500">Please log in to view your watchlist</div>;
  }

  // Fetch watchlist from backend
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/watchlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.stocks && Array.isArray(data.stocks)) {
          setWatchlist(data.stocks);
        } else {
          setWatchlist([]);
        }
      } catch (err) {
        console.error('Error fetching watchlist:', err);
        setError('Failed to load watchlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [token]);

  const fetchPrices = async () => {
    if (watchlist.length === 0) return;

    try {
      const updatedStocks = await Promise.all(
        watchlist.map(async (stock) => {
          try {
            const url = `${STOCK_API_URL}?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=${STOCK_API_KEY}`;
            const fallbackUrl = `${STOCK_API_URL}?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=${DEMO_API_KEY}`;
            const data = await fetchAlphaVantage(url, fallbackUrl);

            const quote = data['Global Quote'];
            if (quote && Object.keys(quote).length > 0) {
              const price = parseFloat(quote['05. price']);
              const change = parseFloat(quote['09. change']);
              const changePercent = parseFloat(quote['10. change percent']?.replace('%', ''));

              return {
                ...stock,
                price: isNaN(price) ? 0 : price,
                change: isNaN(change) ? 0 : change,
                changePercent: isNaN(changePercent) ? 0 : changePercent,
                lastUpdated: new Date().toISOString(),
              };
            } else {
              return { ...stock, error: 'No quote data available' };
            }
          } catch (err) {
            return { ...stock, error: 'Failed to fetch price' };
          }
        })
      );

      setWatchlist(updatedStocks);
    } catch (err) {
      console.error('Error in fetchPrices:', err);
      setError('Failed to update prices');
    }
  };

  useEffect(() => {
    if (watchlist.length === 0) return;
    fetchPrices();
    intervalRef.current = setInterval(fetchPrices, 30000);
    return () => clearInterval(intervalRef.current);
  }, [watchlist.length]);

  const validateStockSymbol = async (symbol) => {
    try {
      const url = `${STOCK_API_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${STOCK_API_KEY}`;
      const fallbackUrl = `${STOCK_API_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${DEMO_API_KEY}`;
      const data = await fetchAlphaVantage(url, fallbackUrl);

      if (
        (typeof data === "object" && (data['Note'] || data['Information'])) ||
        (typeof data === "string" && (data.includes("rate limit") || data.includes("API key")))
      ) {
        return { valid: false, error: 'API rate limit exceeded. Try again later.' };
      }

      if (data['Global Quote'] && Object.keys(data['Global Quote']).length > 0) {
        const quote = data['Global Quote'];
        return {
          valid: true,
          data: {
            symbol: quote['01. symbol'] || symbol.toUpperCase(),
            name: quote['01. symbol'] || symbol.toUpperCase(),
            price: parseFloat(quote['05. price']) || 0,
            change: parseFloat(quote['09. change']) || 0,
            changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0,
          },
        };
      } else if (data['Error Message']) {
        return { valid: false, error: 'Invalid stock symbol' };
      } else if (data['Information']) {
        return { valid: false, error: data['Information'] };
      } else {
        return { valid: false, error: 'Invalid stock symbol or no data' };
      }
    } catch (err) {
      console.error('Error validating stock symbol:', err);
      return { valid: false, error: 'Failed to validate symbol' };
    }
  };

  const addToWatchlist = async () => {
    if (!newStock.symbol.trim()) {
      alert('Please enter a stock symbol');
      return;
    }

    const symbol = newStock.symbol.toUpperCase();
    if (watchlist.some((stock) => stock.symbol === symbol)) {
      alert('Stock already in watchlist');
      return;
    }

    setLoading(true);
    try {
      const validation = await validateStockSymbol(symbol);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      const res = await fetch(`http://localhost:5000/api/watchlist/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          symbol,
          name: newStock.name || validation.data.name,
        }),
      });

      const data = await res.json();
      if (data.stocks && Array.isArray(data.stocks)) {
        setWatchlist(data.stocks);
      } else {
        const newStockEntry = {
          ...validation.data,
          addedDate: new Date().toISOString(),
        };
        setWatchlist((prev) => [...prev, newStockEntry]);
      }

      setNewStock({ symbol: '', name: '' });
      setShowAddForm(false);
    } catch (err) {
      alert('Failed to add stock');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (symbol) => {
    if (!window.confirm(`Remove ${symbol} from watchlist?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/watchlist/${symbol}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.stocks && Array.isArray(data.stocks)) {
        setWatchlist(data.stocks);
      } else {
        setWatchlist((prev) => prev.filter((stock) => stock.symbol !== symbol));
      }
    } catch {
      alert('Failed to remove stock');
    }
  };

  const getFilteredStocks = () => {
    let filtered = watchlist;
    if (filter === 'gainers') {
      filtered = filtered.filter((stock) => (stock.change || 0) > 0);
    } else if (filter === 'losers') {
      filtered = filtered.filter((stock) => (stock.change || 0) < 0);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (stock.name && stock.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  const filteredStocks = getFilteredStocks();

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white p-6 transition-colors duration-300">
      {isDemoKey && (
        <div className="bg-yellow-600 text-white p-2 rounded mb-4">
          Warning: Using Alpha Vantage demo API key. Price updates may not work or may be rate-limited.
        </div>
      )}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-green-700 dark:text-green-400">FinFolio</h1>
          <p className="text-gray-500 dark:text-gray-400">Watchlist & Real-time Updates</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <button onClick={() => setShowAlerts(prev => !prev)} className="focus:outline-none">
              <Bell className="cursor-pointer" />
            </button>
            {showAlerts && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-lg p-4 z-50">
                <h4 className="font-bold mb-2">Notifications</h4>
                {watchlist.length === 0 ? (
                  <p className="text-sm text-gray-500">No alerts yet</p>
                ) : (
                  <ul className="text-sm space-y-2 max-h-60 overflow-y-auto">
                    {watchlist.map((stock, i) => {
                      if (typeof stock.changePercent !== 'number') return null;
                      return (
                        <li key={i}>
                          <span className="font-semibold">{stock.symbol}</span> is{' '}
                          {stock.changePercent >= 0 ? (
                            <span className="text-green-500">up</span>
                          ) : (
                            <span className="text-red-500">down</span>
                          )}{' '}
                          {Math.abs(stock.changePercent).toFixed(2)}%
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row items-center justify-between mb-4 space-y-4 md:space-y-0">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stocks..."
            className="w-full pl-10 pr-4 py-2 rounded bg-gray-100 text-black placeholder-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        <div className="flex space-x-2">
          {['all', 'gainers', 'losers'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded ${
                filter === type
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-100 text-black dark:bg-gray-700 dark:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1 bg-yellow-400 px-4 py-2 text-black rounded"
        >
          <Plus />
          <span>Add</span>
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-700 rounded">
          <input
            value={newStock.symbol}
            onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value })}
            placeholder="Stock Symbol (e.g., AAPL)"
            className="p-2 rounded mr-2 bg-gray-100 text-black dark:bg-gray-800 dark:text-white"
          />
          <input
            value={newStock.name}
            onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
            placeholder="Company Name (optional)"
            className="p-2 rounded mr-2 bg-gray-800 text-white"
          />
          <button onClick={addToWatchlist} className="bg-green-500 px-4 py-2 rounded text-white">
            Add
          </button>
        </div>
      )}

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {filteredStocks.length === 0 ? (
        <p>No stocks found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredStocks.map((stock) => (
            <div
              key={stock.symbol}
              className="p-4 rounded-lg shadow-sm bg-white text-gray-900 dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 hover:border-yellow-400 transition duration-300 ease-in-out"
            >
              <button
                onClick={() => removeFromWatchlist(stock.symbol)}
                className="absolute top-2 right-2 text-red-500 hover:text-white"
              >
                <X />
              </button>
              <h3 className="text-xl font-bold">{stock.symbol}</h3>
              <p className="text-gray-400">{stock.name}</p>
              <p className="text-2xl mt-2">${stock.price?.toFixed(2) || '—'}</p>
              <p className={`mt-1 ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stock.change >= 0 ? <TrendingUp /> : <TrendingDown />}
                {`${stock.change?.toFixed(2) || 0} (${stock.changePercent?.toFixed(2) || 0}%)`}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Last updated:{' '}
                {stock.lastUpdated && new Date(stock.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
