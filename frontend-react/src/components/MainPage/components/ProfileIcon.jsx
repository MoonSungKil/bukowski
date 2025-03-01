import React from "react";
import "./ProfileIcon.css";
import { useNavigate } from "react-router-dom";
import { useSiteState } from "../../../context/SiteStateContext";

export const ProfileIcon = () => {
  const { logoutUser, userLoggedIn } = useSiteState();

  const profilePicture = userLoggedIn.profile_picture;

  const navigate = useNavigate();

  const logOutAndRedirect = () => {
    logoutUser();
    navigate("/");
  };

  const navigateToProfile = () => {
    navigate(`/profile/${userLoggedIn.username}`);
  };

  return (
    <div className="profile_icon_container">
      <div onClick={navigateToProfile} className="profile_icon_wrapper">
        <div className="profile_icon">
          <div className="profile_icon_username">{userLoggedIn.username}</div>
          <div className="profile_icon_image">
            <img src={profilePicture} alt="profile_picture" />
          </div>
        </div>
      </div>
      <div onClick={logOutAndRedirect} className="profile_icon_logout_btn">
        <p className="profile_icon_logout_btn_text">Log Out</p>
      </div>
      {userLoggedIn.balance && (
        <div className="profile_icon_balance">${`${userLoggedIn.balance} `.slice(0.8)}</div>
      )}
    </div>
  );
};
