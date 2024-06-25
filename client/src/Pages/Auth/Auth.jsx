import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Auth.css";
import icon from "../../assets/icon.png";
import AboutAuth from "./AboutAuth";
import { signup, login } from "../../actions/auth";
import LanguageSwitcher from "../../components/LanguageSwitcher/LanguageSwitcher";
import { toast } from "react-toastify";

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
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [receivedOtp, setReceivedOtp] = useState('');

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
    setOtpSent(false);

    if (!email || !password || (isSignup && (!name || !phoneNumber))) {
      setError(t('PleaseFillOutAllFields'));
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        await dispatch(signup({ name, email, password, phoneNumber }, navigate));
      } else {
        try{
          
          const response = await fetch('http://localhost:8080/chrome-verify',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              method: 'email',
              contact: email,
              pass: password
            }),
          });
          const data = await response.json();
          if (data.success) {
            if(data.browser === "Edge"){
              dispatch(login({ email, password }, navigate));
            }else{
            setReceivedOtp(data.otp);
            setOtpSent(true);}
          }else {
            toast.error(t('wrongCredentials'))
          }

        }catch(error){
          console.error('Error sending OTP:', error);
          setError(t('languageSwitcher.failedToSendOTP'));
        }

      }
    } catch (err) {
      setError(t('AuthenticationFailed'));
    }
    setLoading(false);
  };

  const verifyOtp = () => {
    if (otpInput === receivedOtp.toString()) {
      dispatch(login({ email, password }, navigate));
      setOtpInput('');
      setOtpSent(false);
      setError('');
    } else {
      setError(t('languageSwitcher.invalidOTP'));
    }
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
        <LanguageSwitcher onOtpVerified={handleOtpVerified} />
      </div>
      {otpSent && (
        <div className="model-overlay">
          <div className="popup-container">
            <h2>{t('languageSwitcher.otpSentTo')} {email}.</h2>
            <input
              type="text"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              className="otp-input"
            /><br /><br />
            <button onClick={verifyOtp} className="popup-btn">
              {t('languageSwitcher.verifyOTP')}
            </button>
            {error && <p>{error}</p>}
          </div>
        </div>
      )}
    </section>
  );
};

export default Auth;
