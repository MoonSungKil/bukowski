import React, { useEffect, useState } from "react";
import "./ComposePage.css";
import Compose from "./components/Compose";
import { useNavigate, useParams } from "react-router-dom";
import { useSiteState } from "../../context/SiteStateContext";

const ComposePage = () => {
  const { userLoggedIn } = useSiteState();

  const [publishModal, setPublishModal] = useState(false);
  const navigate = useNavigate();
  const { username } = useParams();

  useEffect(() => {
    if (userLoggedIn.username !== username) {
      navigate("/");
    }
  }, [userLoggedIn, username, navigate]);

  return (
    <div className="compose_page">
      <Compose publishModal={publishModal} setPublishModal={setPublishModal} />
    </div>
  );
};

export default ComposePage;
