import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Auth.css";
import icon from "../../assets/icon.png";
import AboutAuth from "./AboutAuth";
import { signup, login } from "../../actions/auth";
import LanguageSwitcher from "../../components/LanguageSwitcher/LanguageSwitcher";

const Auth = () => {
  const { t, i18n } = useTranslation();
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

  const handleOtpVerified = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
  };

  

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
      setError(t('PleaseFillOutAllFields'));
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
      setError(t('AuthenticationFailed'));
    }
    setLoading(false);
  };

  return (
    <section className="auth-section">
      <LanguageSwitcher onOtpVerified={handleOtpVerified} />
      {isSignup && <AboutAuth />}
      <div className="auth-container-2">
        <img src={icon} alt="stack overflow" className="login-logo" />
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <label htmlFor="name">
                <h4>{t('DisplayName')}</h4>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label htmlFor="phoneNumber">
                <h4>{t('PhoneNumber')}</h4>
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
            <h4>{t('Email')}</h4>
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
              <h4>{t('Password')}</h4>
              <button
                type="button"
                style={{ color: "#007ac6", fontSize: "13px", backgroundColor: "transparent", border: "none" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? t('Hide') : t('Show')}
              </button>
              {!isSignup && (
                <Link to="/forgotpassword" style={{ color: "#007ac6", fontSize: "13px", textDecoration: "none", marginTop: "2.5%" }}>
                  {t('ForgotPassword')}
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
            {loading ? t('Processing') : isSignup ? t('SignUp') : t('Login')}
          </button>
        </form>
        <p>
          {isSignup ? t('AlreadyHaveAccount') : t('DontHaveAccount')}
          <button
            type="button"
            className="handle-switch-btn"
            onClick={handleSwitch}
          >
            {isSignup ? t('Login') : t('SignUp')}
          </button>
        </p>
      </div>
    </section>
  );
};

export default Auth;
