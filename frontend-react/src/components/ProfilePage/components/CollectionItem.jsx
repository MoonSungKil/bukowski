import React from "react";
import "./CollectionItem.css";

const CollectionItem = ({ title }) => {
  return (
    <div className="collection_item_container">
      <div className="collection_item">
        <div className="collection_item_backdrop">
          <p className="collection_item_title">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default CollectionItem;
