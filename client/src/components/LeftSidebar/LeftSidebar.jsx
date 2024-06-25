import React from "react";

import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Globe from "../../assets/Globe.svg";
import "./LeftSidebar.css";

const LeftSidebar = ({ slideIn, handleSlideIn }) => {
  const { t } = useTranslation();

  const slideInStyle = {
    transform: "translateX(0%)",
  };

  const slideOutStyle = {
    transform: "translateX(-100%)",
  };
  
  return (
    <div className="left-sidebar" style={slideIn ? slideInStyle : slideOutStyle}>
      <nav className="side-nav">
        <button  className="nav-btn">
          <NavLink to="/" className="side-nav-links" activeclassname="active">
            <p>{t("home")}</p>
          </NavLink>
        </button>
        <div className="side-nav-div">
          <div>
            <p>{t("public")}</p>
          </div>
          <button  className="nav-btn">
            <NavLink to="/Questions" className="side-nav-links" activeclassname="active">
              <img src={Globe} alt="Globe" />
              <p style={{ paddingLeft: "10px" }}>{t("questions")}</p>
            </NavLink>
          </button>
          <button  className="nav-btn">
            <NavLink to="/Tags" className="side-nav-links" activeclassname="active" style={{ paddingLeft: "40px" }}>
              <p>{t("tags")}</p>
            </NavLink>
          </button>
          <button  className="nav-btn">
            <NavLink to="/Users" className="side-nav-links" activeclassname="active" style={{ paddingLeft: "40px" }}>
              <p>{t("users")}</p>
            </NavLink>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default LeftSidebar;
