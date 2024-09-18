import React, { useEffect, useState } from "react";
import travelvideo from "../videos/travel.mov";
import Logo from "../assets/logo.png";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import "../styles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    let name = e.target.name.value;
    let lastname = e.target.lastname.value;
    let email = e.target.email.value;
    let password = e.target.password.value;
    let confirmPassword = e.target.confirmPassword.value;
    const passwordRegex = /^(?=.*\d)[A-Za-z\d@$!%*?&]{5,}$/;
    const baseUrl = import.meta.env.VITE_BASE_URL;

    if (
      name.length > 0 &&
      lastname.length > 0 &&
      email.length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0
    ) {
      if (!passwordRegex.test(password)) {
        toast.error(
          "Password must be at least 5 characters long and include a number, and a special character."
        );
        return;
      }
      if (password === confirmPassword) {
        const formData = {
          username: name + " " + lastname,
          email,
          password,
        };
        try {
          const response = await axios.post(
            `${baseUrl}/api/v1/register`,
            formData
          );
          toast.success("Registration successful");
          navigate("/login");
        } catch (err) {
          toast.error(
            err.response?.data?.msg || "Registration failed. Please try again."
          );
        }
      } else {
        toast.error("Passwords don't match");
      }
    } else {
      toast.error("Please fill all inputs");
    }
  };

  useEffect(() => {
    if (token !== "") {
      toast.success("You already logged in");
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="register-main">
      <div className="register-left">
        <video src={travelvideo} autoPlay muted loop />
      </div>
      <div className="register-right">
        <div className="register-right-container">
          <div className="register-logo">
            <img src={Logo} alt="" />
          </div>
          <div className="register-center">
            <h2>Welcome!</h2>
            <p>Please enter your details</p>
            <form onSubmit={handleRegisterSubmit}>
              <input
                type="text"
                placeholder="First name"
                name="name"
                required={true}
              />
              <input
                type="text"
                placeholder="Last name"
                name="lastname"
                required={true}
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                required={true}
              />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  required={true}
                />
                {showPassword ? (
                  <FaEyeSlash
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                ) : (
                  <FaEye
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                )}
              </div>
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  required={true}
                />
                {showPassword ? (
                  <FaEyeSlash
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                ) : (
                  <FaEye
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                )}
              </div>
              <div className="register-center-buttons">
                <button type="submit" className="register-btn">
                  Sign Up
                </button>
              </div>
            </form>
          </div>

          <p className="login-bottom-p">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
