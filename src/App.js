import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './AuthForm';
import Home from './Home'; 
import Inventory from './InventoryPage'; 
import './App.css';
import SalesPage from "./SalesPage";
import AddSalesPage from './AddSalesPage';
import ReportsPage from './ReportsPage';
import MonthDetails from './MonthDetails';
import AddDamagedGood from './AddDamagedGood';




function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
            <Route path="/add-sale" element={<AddSalesPage />} />
        <Route path="/report" element={<ReportsPage />} />

          <Route path="/sales" element={<SalesPage />} />
<Route path="/month/:year/:month" element={<MonthDetails />} />
<Route path="/add-damage" element={<AddDamagedGood />} />



        </Routes>
      </div>
    </Router>
  );
}

export default App;
