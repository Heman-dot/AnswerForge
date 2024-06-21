import React from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import "./RightSidebar.css";
import pen from "../../assets/pen-solid.svg";
import blackLogo from "../../assets/blacklogo.svg";

const Widget = () => {
  const { t } = useTranslation(); 

  return (
    <div className="widget">
      <h4>{t("overflow_blog")}</h4>
      <div className="right-sidebar-div-1">
        <div className="right-sidebar-div-2">
          <img src={pen} alt="pen" width="18" />
          <p>{t("podcast_title")}</p>
        </div>
        <div className="right-sidebar-div-2">
          <img src={pen} alt="pen" width="18" />
          <p>{t("podcast_title")}</p>
        </div>
      </div>
      <h4>{t("meta_title")}</h4>
      <div className="right-sidebar-div-1">
        <div className="right-sidebar-div-2">
          <img src={pen} alt="pen" width="18" />
          <p>{t("review_queue")}</p>
        </div>
        <div className="right-sidebar-div-2">
          <img src={pen} alt="pen" width="18" />
          <p>{t("valued_associates")}</p>
        </div>
        <div className="right-sidebar-div-2">
          <img src={blackLogo} alt="pen" width="18" />
          <p>{t("outdated_answers")}</p>
        </div>
      </div>
      <h4>{t("hot_meta_posts")}</h4>
      <div className="right-sidebar-div-1">
        <div className="right-sidebar-div-2">
          <p>38</p>
          <p>{t("spam_flag_declined")}</p>
        </div>
        <div className="right-sidebar-div-2">
          <p>20</p>
          <p>{t("best_course_of_action")}</p>
        </div>
        <div className="right-sidebar-div-2">
          <p>14</p>
          <p>{t("how_to_ask_help")}</p>
        </div>
      </div>
    </div>
  );
};

export default Widget;
