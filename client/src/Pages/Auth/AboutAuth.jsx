import React from "react";
import { useTranslation } from "react-i18next";

const AboutAuth = () => {
  const { t } = useTranslation();

  return (
    <div className="auth-container-1">
      <h1>{t('aboutAuth.title')}</h1>
      <p>{t('aboutAuth.askQuestion')}</p>
      <p>{t('aboutAuth.unlockPrivileges')}</p>
      <p>{t('aboutAuth.saveFavorites')}</p>
      <p>{t('aboutAuth.earnReputation')}</p>
      <p style={{ fontSize: "13px", color: "#666767" }}>
        {t('aboutAuth.collaborate')}
      </p>
      <p style={{ fontSize: "13px", color: "#007ac6" }}>
        {t('aboutAuth.teamsOffer')}
      </p>
    </div>
  );
};

export default AboutAuth;
