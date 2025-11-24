import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Project from "./pages/Project";
import Cart from "./pages/Cart";
import LoginSignup from "./pages/LoginSignup";
import Wishlist from "./pages/Wishlist";

//Menu Pages
import SensorsSensorModules from "./Product/SensorsSensorModules"

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <Router>
      <Header onLoginClick={() => setShowLogin(true)} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/project" element={<Project />} />
        <Route path="/carts" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
         <Route path="/SensorsSensorModules" element={<SensorsSensorModules />} />
      </Routes>
      {showLogin && <LoginSignup onClose={() => setShowLogin(false)} />}

      <Footer />
    </Router>
  );
};

export default App;
