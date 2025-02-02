import React from "react";
import "./QuickFilteredTale.css";
import { useNavigate } from "react-router-dom";

const QuickFilteredTale = ({ tale, setKeyword }) => {
  const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  const taleImage = `${backendURL}${tale.tale_image}`;

  const navigate = useNavigate();
  const navigateToTale = () => {
    navigate(`/tale/${tale.id}`);
    setKeyword("");
  };

  return (
    <div onClick={() => navigateToTale()} className="quick_filter_tale">
      <div className="quick_filter_tale_image">
        <img src={taleImage} alt="tale_image" />
      </div>
      <p className="quick_filter_tale_title">{tale.title}</p>
    </div>
  );
};

export default QuickFilteredTale;
