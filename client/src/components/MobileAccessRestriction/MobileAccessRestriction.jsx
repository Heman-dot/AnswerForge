import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MobileAccessRestriction = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndRedirect = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const currentTime = new Date();
      const currentHour = currentTime.getHours();

      if (isMobile && (currentHour < 10 || currentHour >= 13)) {
        navigate('/restricted-access'); 
      }
    };

    checkAndRedirect();
  }, [navigate]);

  return null; 
};

export default MobileAccessRestriction;
