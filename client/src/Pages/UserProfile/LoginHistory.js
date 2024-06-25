import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getUserLoginHistory } from '../../api';

const LoginHistory = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loginHistory, setLoginHistory] = useState([]);

  useEffect(() => {
    const fetchLoginHistory = async () => {
      try {
        const response = await getUserLoginHistory();
        if (response.status === 200 && Array.isArray(response.data)) {
          setLoginHistory(response.data);
        } else {
          console.error('Invalid login history data:', response.data);
        }
      } catch (error) {
        console.error('Error fetching login history:', error);
      }
    };

    fetchLoginHistory();
  }, [dispatch]);

  return (
    <div className="login-history">
      <h2>{t('loginHistory')}</h2>
      {loginHistory.map((login, index) => (
        <div key={index} className="login-entry">
          <p><strong>{t('IPAddress')}:</strong> {login.ip} | <strong>{t('Browser')}:</strong> {login.browser} | <strong>{t('OS')}:</strong> {login.os} | <strong>{t('DeviceType')}:</strong> {login.device} | <strong>{t('Timestamp')}:</strong> {new Date(login.loginTime).toLocaleString()}</p>
          <hr className="login-divider" />
        </div>
      ))}
    </div>
  );
};

export default LoginHistory;
