// RestrictedAccessPage.jsx

import React from "react";
import { useTranslation } from "react-i18next";

const RestrictedAccessPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="popup-overlay">
          <div className="popup-container">
          <h2>{t('accessTimeMessage')}</h2>
            
          </div>
        </div>
      <style>
        {
          `.popup-overlay {
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
          }`
        }
      </style>
    </div>
  );
};

export default RestrictedAccessPage;
