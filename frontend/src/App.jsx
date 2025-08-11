import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import StockSearch from "./components/StockSearch";
import Dashboard from "./components/Dashboard";
import ErrorBoundary from "./components/ErrorBoundary";
import PortfolioHoldings from "./components/PortfolioHoldings";
import Alerts from "./components/Alerts"; // Uncomment if you want to use Alerts component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
      
        <Route path="/stock-search" 
               element={
                <ErrorBoundary>
                 <StockSearch />
                </ErrorBoundary>
              } />
        <Route path="/dashboard"
                element={
                <ErrorBoundary>
                 <Dashboard />
                </ErrorBoundary>
              } />      
      </Routes>
    </Router>
  );
};

export default App;
