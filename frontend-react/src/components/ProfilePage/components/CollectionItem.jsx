import React from "react";
import "./CollectionItem.css";

const CollectionItem = ({ tale, clickHandler }) => {
  const coverImage = tale.tale_image
    ? tale.tale_image
    : "https://res.cloudinary.com/dscuqiqmz/image/upload/v1739617686/bukowski_draft_images/tale_placeholder.jpg";

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
