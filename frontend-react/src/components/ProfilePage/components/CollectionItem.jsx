import React from "react";
import "./CollectionItem.css";

const CollectionItem = ({ tale, clickHandler }) => {
  const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  const coverImage = tale.tale_image
    ? `${backendURL}${tale.tale_image}`
    : `${backendURL}/uploads/tale_covers/cover_placeholder.jpg`;

  return (
    <div onClick={clickHandler} className="collection_item_container">
      <div className="collection_item">
        <img className="collection_item_image" src={coverImage} alt="tale_image" />
        <div className="collection_item_backdrop">
          <p className="collection_item_title">{tale.title}</p>
        </div>
      </div>
    </div>
  );
};

export default CollectionItem;
