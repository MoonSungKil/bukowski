import React, { useEffect } from "react";
import "./ProfilePage.css";
import { useSiteState } from "../../context/SiteStateContext";
import { useNavigate, useParams } from "react-router-dom";
import ProfilePageTop from "./components/ProfilePageTop";

const ProfilePage = () => {
  const navigate = useNavigate();

  const { userLoggedIn } = useSiteState();
  const { id } = useParams();

  useEffect(() => {
    if (!userLoggedIn || !userLoggedIn.id || userLoggedIn.id !== Number(id)) {
      navigate("/");
    }
  }, [userLoggedIn, id, navigate]);

  return (
    <div className="profile_page">
      <ProfilePageTop typeSelected={"purchased"} />
    </div>
  );
};

export default ProfilePage;
