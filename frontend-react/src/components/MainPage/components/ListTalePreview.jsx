import React, { useEffect, useState, useRef } from "react";
import "./ListTalePreview.css";
import { useNavigate } from "react-router-dom";
import ListGenreBox from "./ListGenreBox";

const ListTalePreview = ({ tale }) => {
  const navigate = useNavigate();

  const navigateToTale = () => {
    navigate(`/tale/${tale.id}`);
  };

  const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  const taleImage = `${backendURL}${tale.tale_image}`;

  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setInnerWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
  }, [innerWidth]);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const taleRef = useRef(null);

  const handleMouseMove = (e) => {
    if (taleRef.current) {
      const rect = taleRef.current.getBoundingClientRect();
      if (window.innerWidth / 1.5 > e.clientX) {
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      } else {
        setPosition({ x: e.clientX - rect.right / 7, y: e.clientY - rect.top });
      }
    }
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHover(false)}
      ref={taleRef}
      className="list_tale_preview"
      onClick={navigateToTale}
    >
      <div className="list_tale_preview_main">
        <img className="list_tale_preview_image" src={taleImage} alt="tale_image" />
      </div>
      <div className="list_tale_preview_title_container">
        <p className="list_tale_preview_title">
          {tale.title.length > 50 ? tale.title.substring(0, 50) + "..." : tale.title}
        </p>
      </div>
      <div className="list_tale_preview_preview">
        <p>
          {innerWidth < 1300 && innerWidth > 1150
            ? tale.preview.substring(0, 600) + "..."
            : innerWidth < 1150 && innerWidth > 900
            ? tale.preview.substring(0, 400) + "..."
            : innerWidth < 900 && innerWidth > 700
            ? tale.preview.substring(0, 250)
            : innerWidth < 700 && innerWidth > 400
            ? tale.preview.substring(0, 100)
            : tale.preview}
        </p>
      </div>
      {/* <div className="list_preview_box_genre_list">
        {tale.genres.map((genre) => (
          <p
            className={`list_preview_box_genre genre_type_name_${genre.name
              .toLowerCase()
              .replace(/[\/\-]/g, "_")}`}
          >
            {genre.name}
          </p>
        ))}
      </div> */}
      <ListGenreBox tale={tale} position={position} hover={hover} />
    </div>
  );
};

export default ListTalePreview;
