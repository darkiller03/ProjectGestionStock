import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import Products from "./dashboard/Product";
import Order from "./dashboard/Order";
import Clients from "./dashboard/Clients";
import Suppliers from "./dashboard/Suppliers";
import Login from "./login/LoginForm";
import PrivateRoute from "./PrivateRoute";

import RootLayout from "./Layout/RootLayout";

import { isAuthenticated } from "./auth";
import ErrorRoute from "./components/ErrorRoute";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  const handleLogin = (status) => {
    setIsLoggedIn(status);
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route
        path="/"
        element={
          isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        }
      />
      <Route element={<PrivateRoute element={RootLayout} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/order" element={<Order />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/suppliers" element={<Suppliers />} />
      </Route>
      <Route
        path="*"
        element={
          isLoggedIn ? (
            <ErrorRoute label="Dashboard" />
          ) : (
            <ErrorRoute label="Login" />
          )
        }
      />
    </Routes>
  );
}

export default App;
