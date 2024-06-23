import React, { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; 

import "./AskQuestion.css";
import { askQuestion } from "../../actions/question";

const AskQuestion = () => {
  
  const {i18n, t } = useTranslation();
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionBody, setQuestionBody] = useState("");
  const [questionTags, setQuestionTags] = useState("");

  const dispatch = useDispatch();
  const User = useSelector((state) => state.currentUserReducer);
  const navigate = useNavigate();
  useEffect(() => {
    const lang = i18n.language;
    switch (lang) {
      case "fr":
        document.getElementById("ask-question").style.backgroundColor = "#FFFAA0";
        break;
      case "hi":
        document.getElementById("ask-question").style.backgroundColor = "#89CFF0";
        break;
      case "zh":
        document.getElementById("ask-question").style.backgroundColor = "#90EE90";
        break;
      default:
        document.getElementById("ask-question").style.backgroundColor = "white";
    }
  }, [i18n.language]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (User) {
      if (questionTitle && questionBody && questionTags) {
        dispatch(
          askQuestion(
            {
              questionTitle,
              questionBody,
              questionTags,
              userPosted: User.result.name,
            },
            navigate
          )
        );
      } else alert(t("askaQuestion.alerts.emptyFields"));
    } else {alert(t("askaQuestion.alerts.loginRequired"))
    navigate("/Auth");
  };
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      setQuestionBody(questionBody + "\n");
    }
  };

  return (
    <div id="ask-question" className="ask-question">
      <div className="ask-ques-container">
        <h1>{t("askaQuestion.pageTitle")}</h1>
        <form onSubmit={handleSubmit}>
          <div className="ask-form-container">
            <label htmlFor="ask-ques-title">
              <h4>{t("askaQuestion.title.label")}</h4>
              <input
                type="text"
                id="ask-ques-title"
                onChange={(e) => {
                  setQuestionTitle(e.target.value);
                }}
                placeholder={t("askaQuestion.title.placeholder")}
              />
            </label>
            <label htmlFor="ask-ques-body">
              <h4>{t("askaQuestion.body.label")}</h4>
              <textarea
                name=""
                id="ask-ques-body"
                onChange={(e) => {
                  setQuestionBody(e.target.value);
                }}
                cols="30"
                rows="10"
                onKeyPress={handleEnter}
                placeholder={t("askaQuestion.body.placeholder")}
              ></textarea>
            </label>
            <label htmlFor="ask-ques-tags">
              <h4>{t("askaQuestion.tags.label")}</h4>
              <input
                type="text"
                id="ask-ques-tags"
                onChange={(e) => {
                  setQuestionTags(e.target.value.split(" "));
                }}
                placeholder={t("askaQuestion.tags.placeholder")}
              />
            </label>
          </div>
          <input
            type="submit"
            value={t("askaQuestion.submitButton")}
            className="review-btn"
          />
        </form>
      </div>
    </div>
  );
};

export default AskQuestion;
