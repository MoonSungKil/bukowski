import React, { useState } from "react";
import "./ProfilePageTop.css";
import ProfileInfoBox from "./ProfileInfoBox";
import ProfileCollection from "./ProfileCollection";

const ProfilePageTop = () => {
  const [keyword, setKeyword] = useState("");
  return (
    <div className="profile_page_top">
      <ProfileInfoBox setKeyword={setKeyword} />
      <ProfileCollection typeSelected={"purchased"} keyword={keyword} setKeyword={setKeyword} />
    </div>
  );
};

export default ProfilePageTop;
