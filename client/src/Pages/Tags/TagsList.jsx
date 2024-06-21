import React from "react";
import { useTranslation } from "react-i18next";
import "./Tags.css";

const TagsList = ({ tag }) => {
  const { t } = useTranslation();

  return (
    <div className="tag">
      <h5>{t(`alltags.${tag.tagName}.title`)}</h5>
      <p>{t(`alltags.${tag.tagName}.desc`)}</p>
    </div>
  );
};

export default TagsList;
