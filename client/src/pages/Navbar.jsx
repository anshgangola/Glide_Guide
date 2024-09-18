import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/logo.png";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="GlideGuide Logo" className="navbar-logo" />
        <span className="navbar-title">GlideGuide</span>
      </div>
      <div className="navbar-right">
        <Link to="/saved-itineraries" className="navbar-link">
          View Saved Itineraries
        </Link>
        <Link to="/logout" className="navbar-button">
          Logout
        </Link>
        <div className="navbar-menu-icon" onClick={toggleMenu}>
          ☰
        </div>
        <div className={`navbar-dropdown ${isMenuOpen ? "show" : ""}`}>
          <Link to="/saved-itineraries" onClick={toggleMenu}>
            View Saved Itineraries
          </Link>
          <Link to="/logout" className="logout-button">
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
