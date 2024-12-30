import React from "react";
import "./ProfileIcon.css";
import ProfilePictureImage from "../../../assets/profilepic.jpg";
import { useUser } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";

export const ProfileIcon = ({ user }) => {
  const { logoutUser } = useUser();

  const navigate = useNavigate();

  const logOutAndRedirect = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="profile_icon_container">
      <div className="profile_icon_wrapper">
        <div className="profile_icon">
          <div className="profile_icon_username">{user.username}</div>
          <div className="profile_icon_image">
            <img src={ProfilePictureImage} alt="profile_picture" />
          </div>
        </div>
      </div>
      <div onClick={logOutAndRedirect} className="profile_icon_logout_btn">
        <p className="profile_icon_logout_btn_text">Log Out</p>
      </div>
    </div>
  );
};
