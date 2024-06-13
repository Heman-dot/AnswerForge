import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import "./Auth.css";
import icon from "../../assets/icon.png";
import AboutAuth from "./AboutAuth";
import { signup, login } from "../../actions/auth";

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSwitch = () => {
    setIsSignup(!isSignup);
    setName("");
    setEmail("");
    setPassword("");
    setPhoneNumber("");  
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || (isSignup && (!name || !phoneNumber))) {
      setError("Please fill out all fields");
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        await dispatch(signup({ name, email, password, phoneNumber }, navigate));
      } else {
        await dispatch(login({ email, password }, navigate));
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <section className="auth-section">
      {isSignup && <AboutAuth />}
      <div className="auth-container-2">
        <img src={icon} alt="stack overflow" className="login-logo" />
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <label htmlFor="name">
                <h4>Display Name</h4>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label htmlFor="phoneNumber">
                <h4>Phone Number</h4>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </label>
            </>
          )}
          <label htmlFor="email">
            <h4>Email</h4>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label htmlFor="password">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4>Password</h4>
              <button
                type="button"
                style={{ color: "#007ac6", fontSize: "13px", marginLeft: "30%", backgroundColor: "transparent", border: "none",marginLeft:"%" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              {!isSignup && (
                <Link to="/forgotpassword" style={{ color: "#007ac6", fontSize: "13px", textDecoration: "none", marginTop:"2.5%" }}>
                  Forgot password?
                </Link>
              )}
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Processing..." : isSignup ? "Sign up" : "Log in"}
          </button>
        </form>
        <p>
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <button
            type="button"
            className="handle-switch-btn"
            onClick={handleSwitch}
          >
            {isSignup ? "Log in" : "Sign up"}
          </button>
        </p>
      </div>
    </section>
  );
};

export default Auth;
