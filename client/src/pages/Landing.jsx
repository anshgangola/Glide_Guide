import React from "react";
import "../styles/Landing.css";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="landing-main">
      <h1>GlideGuide</h1>
      <p className="tag-line">Effortless Itineraries for Every Traveler</p>
      <p className="welcome-line">
        {" "}
        Welcome! Let's Tailor Your Next Adventure Together.{" "}
      </p>
      <Link to="/login" className="landing-login-button">
        Login
      </Link>
      <Link to="/register" className="landing-register-button">
        Register
      </Link>
    </div>
  );
};

export default Landing;
