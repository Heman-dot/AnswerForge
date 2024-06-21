import React, { useState } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import { useTranslation } from 'react-i18next';

export default function ForgotPassword() {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const digits = '0123456789';

  const handleOtpChange = (event) => {
    setOtpValue(event.target.value);
  };

  const sendEmail = async (e) => {
    setProgress(20);
    e.preventDefault();

    try {
      let OTP = '';
      for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }
      setOtp(OTP);

      setProgress(50);

      await axios.post(`http://localhost:8080/sendEmail`, { email, OTP })
        .then(res => {
          if (res.data === 'pass') {
            toast.success(t('forgotPassword.codeSent'));
            setShowPopup(true);
          } else if (res.data === 'notexist') {
            toast.error(t('forgotPassword.userNotFound'));
          } else if (res.data === 'fail') {
            toast.error(t('forgotPassword.somethingWentWrong'));
          }
        })
        .catch(() => {
          toast.error(t('forgotPassword.somethingWentWrong'));
        });
      setProgress(70);
    } catch (e) {
      toast.error(t('forgotPassword.somethingWentWrong'));
    }
    setProgress(100);
  };

  const otpCheck = () => {
    if (otp !== otpValue) {
      toast.error(t('forgotPassword.invalidCode'));
    } else {
      navigate("/resetpassword");
    }
  };

  return (
    <div>
      <LoadingBar
        color='red'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <h2>{t('forgotPassword.enterCode')}</h2>
            <input style={{marginLeft:"-4%"}}
              type="text"
              maxLength="6"
              value={otpValue}
              onChange={handleOtpChange}
              className="otp-input"
            />
            <p>{t('forgotPassword.enterCodeMessage')}</p>
            <button onClick={otpCheck} className="popup-btn">{t('forgotPassword.submit')}</button>
          </div>
        </div>
      )}

      <form onSubmit={sendEmail} className="forgot-password-form">
        <section className="auth-section">
          <div className="auth-container-2">
            <h2 className="title">{t('forgotPassword.title')}</h2>
            <label htmlFor="email">
              <h4>{t('forgotPassword.email')}</h4>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="auth-btn">{t('forgotPassword.submit')}</button>
            <p>
              <Link to="/Auth">{t('forgotPassword.login')}</Link>
            </p>
          </div>
        </section>
      </form>

      <style>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          backdrop-filter: blur(5px);
          z-index: 1000;
        }

        .popup-container {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .popup-container h2 {
          margin-bottom: 1rem;
        }

        .otp-input {
          width: 50%;
          padding: 0.75rem;
          margin-bottom: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          text-align: center;
          font-size: 1.25rem;
        }

        .popup-btn {
          background-color: #007ac6;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s;
        }

        .popup-btn:hover {
          background-color: #005f99;
        }

        .auth-section {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f5f5f5;
        }

        .auth-container-2 {
          background-color: #fff;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        .auth-btn {
          background-color: #007ac6;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s;
        }

        .auth-btn:hover {
          background-color: #005f99;
        }

        .title {
          margin-bottom: 1rem;
        }

        label {
          display: block;
          margin-bottom: 1rem;
        }

        label h4 {
          margin-bottom: 0.5rem;
        }

        input {
          width: 100%;
          padding: 0.75rem;
          margin-bottom: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        input:focus {
          border-color: #007ac6;
          outline: none;
        }

        .forgot-password-form p {
          margin-top: 1rem;
        }

        .forgot-password-form p a {
          color: #007ac6;
          text-decoration: none;
        }

        .forgot-password-form p a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
