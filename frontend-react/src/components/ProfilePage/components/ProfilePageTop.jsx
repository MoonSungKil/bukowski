import React from "react";
import "./ProfilePageTop.css";
import ProfileInfoBox from "./ProfileInfoBox";
import ProfileCollection from "./ProfileCollection";

const ProfilePageTop = () => {
  return (
    <div className="profile_page_top">
      <ProfileInfoBox />
      <ProfileCollection typeSelected={"purchased"} />
    </div>
  );
};

export default ProfilePageTop;
