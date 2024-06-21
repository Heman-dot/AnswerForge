import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import "./HomeMainbar.css";
import QuestionList from "./QuestionList";

const HomeMainbar = () => {
  const { t } = useTranslation(); 
  const location = useLocation();
  const user = 1; 
  const navigate = useNavigate();

  const questionsList = useSelector((state) => state.questionsReducer);

  const checkAuth = () => {
    if (user === null) {
      alert(t("loginAlert"));
      navigate("/Auth");
    } else {
      navigate("/AskQuestion");
    }
  };

  return (
    <div className="main-bar">
      <div className="main-bar-header">
        {location.pathname === "/" ? (
          <h1>{t("topQuestions")}</h1>
        ) : (
          <h1>{t("allQuestions")}</h1>
        )}
        <button onClick={checkAuth} className="ask-btn">
          {t("askQuestion")} {}
        </button>
      </div>
      <div>
        {questionsList.data === null ? (
          <h1>{t("loading")}</h1> 
        ) : (
          <>
            <p>
              {questionsList.data.length} {t("questionsCount")} {}
            </p>
            <QuestionList questionsList={questionsList.data} />
          </>
        )}
      </div>
    </div>
  );
};

export default HomeMainbar;
