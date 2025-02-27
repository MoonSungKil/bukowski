import React, { useState } from "react";
import "./CollectionFilterButtons.css";
import { useProfileState } from "../../../context/ProfileStateContext";

const CollectionFilterButtons = ({ setKeyword }) => {
  const { selectedCollectionType } = useProfileState();

  const [selected, setSelected] = useState("published");

  const setCollectionType = (collectionType) => {
    selectedCollectionType(collectionType.toLowerCase());
    setSelected(collectionType.toLowerCase());
    setKeyword("");
  };

  return (
    <div className="collection_filter_buttons">
      <ul className="collection_filter_buttons_list">
        <li
          onClick={() => setCollectionType("published")}
          className={`collection_filter_buttons_list_item ${
            selected === "published" && "collection_filter_buttons_list_item_selected"
          }`}
        >
          PUBLISHED
        </li>
        <li
          onClick={() => setCollectionType("purchased")}
          className={`collection_filter_buttons_list_item ${
            selected === "purchased" && "collection_filter_buttons_list_item_selected"
          }`}
        >
          PURCHASES
        </li>
        <li
          onClick={() => setCollectionType("drafts")}
          className={`collection_filter_buttons_list_item ${
            selected === "drafts" && "collection_filter_buttons_list_item_selected"
          }`}
        >
          DRAFTS
        </li>
        <li
          onClick={() => setCollectionType("wishlist")}
          className={`collection_filter_buttons_list_item ${
            selected === "wishlist" && "collection_filter_buttons_list_item_selected"
          }`}
        >
          WISHLIST
        </li>
      </ul>
    </div>
  );
};

export default CollectionFilterButtons;
