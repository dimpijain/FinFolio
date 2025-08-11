import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

// Modal for adding a holding
const AddHoldingModal = ({ show, onClose, onAdd, userId }) => {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [error, setError] = useState("");

  // Example stock options; in a real app, fetch from backend or API
  const stockOptions = [
    "TCS.BSE",
    "INFY.BSE",
    "RELIANCE.BSE",
    "HDFCBANK.BSE"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symbol || !quantity || !purchasePrice) {
      setError("All fields are required");
      return;
    }
    try {
      await axios.post(`/api/portfolio/${userId}/holdings`, {
        symbol,
        quantity: Number(quantity),
        purchasePrice: Number(purchasePrice),
      });
      onAdd(); // Refresh holdings in parent
      onClose();
      setSymbol("");
      setQuantity("");
      setPurchasePrice("");
      setError("");
    } catch {
      setError("Failed to add holding");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Holding</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Stock Symbol</label>
          <select
            className="w-full mb-4 p-2 border rounded"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          >
            <option value="">Select a stock</option>
            {stockOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <label className="block mb-2">Quantity</label>
          <input
            type="number"
            className="w-full mb-4 p-2 border rounded"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <label className="block mb-2">Purchase Price</label>
          <input
            type="number"
            className="w-full mb-4 p-2 border rounded"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
          />
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ALPHA_VANTAGE_API_KEY = "YOUR_ALPHA_VANTAGE_API_KEY"; // Replace with your key

const PortfolioHoldings = ({ userId }) => {
  const [holdings, setHoldings] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Fetch holdings from backend
  const fetchHoldings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`/api/portfolio/${userId}/holdings`);
      setHoldings(res.data.holdings || []);
    } catch (err) {
      setError("Failed to fetch holdings",err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHoldings();
    // eslint-disable-next-line
  }, [userId]);

  // Fetch current prices for all holdings
  useEffect(() => {
    if (!holdings.length) return;
    const fetchPrices = async () => {
      setLoading(true);
      setError("");
      const newPrices = {};
      for (const h of holdings) {
        try {
          const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${h.symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
          const response = await axios.get(url);
          const data = response.data["Global Quote"];
          if (data && data["05. price"]) {
            newPrices[h.symbol] = Number(data["05. price"]);
          } else {
            newPrices[h.symbol] = null;
          }
        } catch {
          newPrices[h.symbol] = null;
        }
      }
      setPrices(newPrices);
      setLoading(false);
    };
    fetchPrices();
   
  }, [holdings]);

  // Calculate total investment
  const totalInvestment = holdings.reduce(
    (sum, h) => sum + h.purchasePrice * h.quantity,
    0
  );

  // Sell handler (call backend to remove, then refetch)
  const handleSell = async (symbol) => {
    try {
      await axios.delete(`/api/portfolio/${userId}/holdings/${symbol}`);
      fetchHoldings();
    } catch {
      setError("Failed to sell holding");
    }
  };

  // Prepare data for the line chart
  const chartData = holdings.map(h => {
    const invested = h.purchasePrice * h.quantity;
    const currentPrice = prices[h.symbol];
    const currentValue = currentPrice ? currentPrice * h.quantity : 0;
    const profitLoss = currentPrice ? currentValue - invested : 0;
    return {
      name: h.symbol,
      profitLoss: Number(profitLoss.toFixed(2))
    };
  });

  return (
    <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-2">
      {/* Holdings box on the left */}
      <div className="w-full md:w-3/4 bg-white rounded-lg shadow p-8 mt-8 md:mr-8 relative min-h-[500px] flex flex-col">
        {/* Total Investment on top right */}
        <div className="absolute right-8 top-8 text-xl font-bold text-green-700">
          Total Investment: ₹{totalInvestment.toFixed(2)}
        </div>
        <h2 className="text-3xl font-bold text-green-700 mb-6">Your Holdings</h2>
        <table className="min-w-full bg-white border mb-4">
          <thead>
            <tr className="bg-green-50">
              <th className="py-2 px-4 border-b text-left">Symbol</th>
              <th className="py-2 px-4 border-b text-left">Quantity</th>
              <th className="py-2 px-4 border-b text-left">Purchase Price</th>
              <th className="py-2 px-4 border-b text-left">Current Price</th>
              <th className="py-2 px-4 border-b text-left">Invested</th>
              <th className="py-2 px-4 border-b text-left">Current Value</th>
              <th className="py-2 px-4 border-b text-left">P/L</th>
              <th className="py-2 px-4 border-b text-left">ROI (%)</th>
              <th className="py-2 px-4 border-b text-left"></th>
            </tr>
          </thead>
          <tbody>
            {holdings.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  No holdings to display.
                </td>
              </tr>
            )}
            {holdings.map((h) => {
              const invested = h.purchasePrice * h.quantity;
              const currentPrice = prices[h.symbol];
              const currentValue = currentPrice ? currentPrice * h.quantity : 0;
              const profitLoss = currentPrice ? currentValue - invested : 0;
              const roi = invested ? (profitLoss / invested) * 100 : 0;
              return (
                <tr key={h.symbol}>
                  <td className="py-2 px-4 border-b">{h.symbol}</td>
                  <td className="py-2 px-4 border-b">{h.quantity}</td>
                  <td className="py-2 px-4 border-b">₹{h.purchasePrice}</td>
                  <td className="py-2 px-4 border-b">
                    {loading
                      ? "Loading..."
                      : currentPrice
                      ? `₹${currentPrice.toFixed(2)}`
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">₹{invested.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">
                    {currentPrice ? `₹${currentValue.toFixed(2)}` : "--"}
                  </td>
                  <td
                    className={`py-2 px-4 border-b ${
                      profitLoss >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {currentPrice ? `₹${profitLoss.toFixed(2)}` : "--"}
                  </td>
                  <td
                    className={`py-2 px-4 border-b ${
                      roi >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {currentPrice ? `${roi.toFixed(2)}%` : "--"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleSell(h.symbol)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded"
                    >
                      Sell
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Add Holding Button at the bottom */}
        <button
          onClick={() => setShowModal(true)}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-3 rounded text-lg transition"
        >
          + Add Holding
        </button>
        {error && (
          <div className="mt-4 text-red-600 font-semibold">{error}</div>
        )}
      </div>
      {/* Right side: Profit/Loss Line Chart */}
      <div className="w-full md:w-1/4 flex flex-col items-center justify-center mt-8">
        <h3 className="text-xl font-bold mb-4 text-green-700">Profit/Loss per Stock</h3>
        <div className="w-full h-96 bg-white rounded-lg shadow flex items-center justify-center p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="profitLoss" stroke="#16a34a" strokeWidth={3} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Add Holding Modal */}
      <AddHoldingModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onAdd={fetchHoldings}
        userId={userId}
      />
    </div>
  );
};

export default PortfolioHoldings;