import React, { useState, useRef } from "react";
import "./TalePreview.css";
import { useNavigate } from "react-router-dom";
import PreviewBox from "./PreviewBox";

const TalePreview = ({ tale }) => {
  const navigate = useNavigate();

  const navigateToTale = () => {
    navigate(`/tale/${tale.id}`);
  };

  const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  const taleImage = `${backendURL}${tale.tale_image}`;

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const taleRef = useRef(null);

  const handleMouseMove = (e) => {
    if (taleRef.current) {
      const rect = taleRef.current.getBoundingClientRect();
      if (window.innerWidth / 1.5 > e.clientX) {
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      } else {
        setPosition({ x: e.clientX - rect.right, y: e.clientY - rect.top });
      }
    }
  };

  return (
    <div className="tale_preview_container">
      <div
        onClick={navigateToTale}
        className="tale_preview"
        onMouseEnter={() => setHover(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHover(false)}
        ref={taleRef}
      >
        <div className="tale_preview_main">
          <img className="tale_preview_image" src={taleImage} alt="tale_image" />
          <div className="tale_preview_add_cart">
            <i className="fa-solid fa-cart-shopping"></i>
          </div>
        </div>
        <div className="tale_preview_title_container">
          <p className="tale_preview_title">
            {tale.title.length > 50 ? tale.title.substring(0, 50) + "..." : tale.title}
          </p>
        </div>
      </div>
      <PreviewBox tale={tale} position={position} hover={hover} />
    </div>
  );
};

export default TalePreview;
