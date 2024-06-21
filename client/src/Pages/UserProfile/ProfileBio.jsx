import React from "react";
import { useTranslation } from "react-i18next";

const ProfileBio = ({ currentProfile }) => {
  const { t } = useTranslation(); 

  return (
    <div>
      <div>
        {currentProfile?.tags.length !== 0 ? (
          <>
            <h4>{t("profile.tagsWatched")}</h4>
            {currentProfile?.tags.map((tag) => (
              <p key={tag}>{tag}</p>
            ))}
          </>
        ) : (
          <p>{t("profile.noTagsWatched")}</p>
        )}
      </div>
      <div>
        {currentProfile?.about ? (
          <>
            <h4>{t("profile.about")}</h4>
            <p>{currentProfile?.about}</p>
          </>
        ) : (
          <p>{t("profile.noBioFound")}</p>
        )}
      </div>
    </div>
  );
};

export default ProfileBio;
