import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = ({ onOtpVerified }) => {
  const { t, i18n } = useTranslation();
  const [contact, setContact] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [receivedOtp, setReceivedOtp] = useState('');
  const [error, setError] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const changeLanguage = async (e) => {
    const language = e.target.value;
    setSelectedLanguage(language);
    setOtpSent(false);

    if (language === 'fr') {
      // Email logic
      const input = prompt(t('languageSwitcher.enterEmail'));
      if (input) {
        setContact(input);
        try {
          const response = await fetch('http://localhost:8080/send-otp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              method: 'email',
              contact: input,
            }),
          });
          const data = await response.json();
          if (data.success) {
            setReceivedOtp(data.otp);
            setOtpSent(true);
          } else {
            setError(t('languageSwitcher.failedToSendOTP'));
          }
        } catch (error) {
          console.error('Error sending OTP:', error);
          setError(t('languageSwitcher.failedToSendOTP'));
        }
      }
    } else {
      // Mobile logic
      const input = prompt(t('languageSwitcher.enterPhoneNumber'));
      if (input) {
        setContact(input);
        try {
          const response = await fetch('http://localhost:8080/send-otp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ method: 'sms', contact: input }),
          });
          const data = await response.json();
          if (data.success) {
            setReceivedOtp(data.otp);
            setOtpSent(true);
          } else {
            setError(t('languageSwitcher.failedToSendOTP'));
          }
        } catch (error) {
          console.error('Error sending OTP:', error);
          setError(t('languageSwitcher.failedToSendOTP'));
        }
      }
    }
  };

  const verifyOtp = () => {
    if (otpInput === receivedOtp.toString()) {
      // OTP verification successful
      onOtpVerified(selectedLanguage); 
      setOtpInput('');
      setOtpSent(false);
      setError('');
    } else {
      setError(t('languageSwitcher.invalidOTP'));
    }
  };

  return (
    <div>
      <div style={{marginTop:"-180%",marginLeft:"400%"}} className="language-switcher">
        <select onChange={changeLanguage} defaultValue={i18n.language}>
          <option value="en">{t('languages.english')}</option>
          <option value="es">{t('languages.spanish')}</option>
          <option value="fr">{t('languages.french')}</option>
          <option value="hi">{t('languages.hindi')}</option>
          <option value="pt">{t('languages.portuguese')}</option>
          <option value="zh">{t('languages.chinese')}</option>
        </select>
      </div>
      {otpSent && (
        <div className="model-overlay">
          <div className="popup-container">
            <h2>{t('languageSwitcher.otpSentTo')} {contact}.</h2>
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
      <style>{`
        .language-switcher {
          display: flex;
          justify-content: center;
          margin-bottom: 10px;
        }
        
        .language-switcher select {
          padding: 10px;
          border: 1px solid #ccc;
          cursor: pointer;
          border-radius: 7px;
        }
        
        .model-overlay {
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
          text-align: center;
          background-color: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          max-width: 80%;
          max-height: 80%;
          overflow: auto;
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
          color: #000;
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher;
