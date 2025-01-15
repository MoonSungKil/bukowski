import React from "react";
import "./ProfileSettingsInfo.css";

const ProfileSettingsInfo = ({ text }) => {
  return (
    <div className="profile_settings_info">
      <p>{text}</p>
    </div>
  );
};

export default ProfileSettingsInfo;
