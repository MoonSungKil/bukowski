import React, { useState } from "react";
import "./Rating.css";
import { useSiteState } from "../../../context/SiteStateContext";

const RatingForm = ({ tale, setEnableRating }) => {
  const { submitRating } = useSiteState();

  const [stars, setStars] = useState([0, 0, 0, 0, 0]);

  const handleSubmit = (tale_id, rating) => {
    if (rating > 0 && rating <= 5) {
      submitRating(tale_id, rating);
      setEnableRating(false);
    }
  };

  return (
    <div className="rating">
      <div
        onMouseEnter={() => setStars([true, false, false, false, false])}
        onMouseLeave={() => setStars([false, false, false, false, false])}
        onClick={() => handleSubmit(tale.ID, 1)}
        className={`rating_element_star ${stars[0] && "rating_element_selected"}`}
      >
        <i className="fa-solid fa-star "></i>
      </div>
      <div
        onMouseEnter={() => setStars([true, true, false, false, false])}
        onMouseLeave={() => setStars([false, false, false, false, false])}
        onClick={() => handleSubmit(tale.ID, 2)}
        className={`rating_element_star ${stars[1] && "rating_element_selected"}`}
      >
        <i className="fa-solid fa-star "></i>
      </div>
      <div
        onMouseEnter={() => setStars([true, true, true, false, false])}
        onMouseLeave={() => setStars([false, false, false, false, false])}
        onClick={() => handleSubmit(tale.ID, 3)}
        className={`rating_element_star ${stars[2] && "rating_element_selected"}`}
      >
        <i className="fa-solid fa-star "></i>
      </div>
      <div
        onMouseEnter={() => setStars([true, true, true, true, false])}
        onMouseLeave={() => setStars([false, false, false, false, false])}
        onClick={() => handleSubmit(tale.ID, 4)}
        className={`rating_element_star ${stars[3] && "rating_element_selected"}`}
      >
        <i className="fa-solid fa-star"></i>
      </div>
      <div
        onMouseEnter={() => setStars([true, true, true, true, true])}
        onMouseLeave={() => setStars([false, false, false, false, false])}
        onClick={() => handleSubmit(tale.ID, 5)}
        className={`rating_element_star ${stars[4] && "rating_element_selected"}`}
      >
        <i className="fa-solid fa-star "></i>
      </div>
    </div>
  );
};

export default RatingForm;
