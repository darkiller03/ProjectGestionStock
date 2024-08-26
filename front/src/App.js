import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import Products from './dashboard/Product';
import Order from './dashboard/Order';
import Clients from './dashboard/Clients';
import Suppliers from './dashboard/Suppliers';
import Login from './login/LoginForm';
import PrivateRoute from './PrivateRoute';
import { isAuthenticated } from './auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  const handleLogin = (status) => {
    setIsLoggedIn(status);
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
      <Route path="/products" element={<PrivateRoute element={Products} />} />
      <Route path="/order" element={<PrivateRoute element={Order} />} />
      <Route path="/clients" element={<PrivateRoute element={Clients} />} />
      <Route path="/suppliers" element={<PrivateRoute element={Suppliers} />} />
      <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default App;
