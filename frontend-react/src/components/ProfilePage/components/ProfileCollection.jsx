import React, { useEffect, useState } from "react";
import "./ProfileCollection.css";
import CollectionItem from "./CollectionItem";
import { useProfileState } from "../../../context/ProfileStateContext";
import { useNavigate, useParams } from "react-router-dom";

const ProfileCollection = ({ keyword, setKeyword }) => {
  const {
    typeCollectionSelected,
    filteredCollection,
    filterCollectionByKeyword,
    selectedCollectionType,
  } = useProfileState();

  const { id } = useParams();

  const setCollectionType = (collectionType) => {
    selectedCollectionType(collectionType.toLowerCase());
    setKeyword("");
  };

  const submitHandler = (e) => {
    e.preventDefault();
    filterCollectionByKeyword(keyword);
  };

  useEffect(() => {
    filterCollectionByKeyword(keyword);
  }, [keyword]);

  const navigate = useNavigate();

  const navigateToEdit = (taleId) => {
    console.log(id, taleId);
    if (typeCollectionSelected.toLowerCase() === "drafts".toLowerCase()) {
      navigate(`/profile/${id}/edit/${taleId}`);
    }

    if (typeCollectionSelected.toLowerCase() === "published".toLocaleLowerCase()) {
      navigate(`/tale/${taleId}`);
    }

    if (typeCollectionSelected.toLocaleLowerCase() === "purchased".toLocaleLowerCase()) {
      navigate(`/tale/${taleId}`);
    }

    if (typeCollectionSelected.toLocaleLowerCase() === "wishlist".toLocaleLowerCase()) {
      navigate(`/tale/${taleId}`);
    }
  };

  return (
    <div className="profile_collection_container">
      <div className="profile_collection">
        <div className="profile_collection_search">
          <div className="profile_collection_search_type">
            <p>{typeCollectionSelected}</p>
          </div>
          <form onSubmit={(e) => submitHandler(e)} className="profile_collection_search_form">
            <input
              onChange={(e) => setKeyword(e.target.value)}
              type="text"
              placeholder="Search for book"
              className="profile_collection_search_input"
              value={keyword}
            />
          </form>
        </div>
      </div>

      {/* <div className="profile_collection_select">
        <ul className="profile_collection_select_list">
          <li
            onClick={() => setCollectionType("published")}
            className="profile_collection_select_list_item"
          >
            PUBLISHED
          </li>
          <li
            onClick={() => setCollectionType("purchased")}
            className="profile_collection_select_list_item"
          >
            PURCHASES
          </li>
          <li
            onClick={() => setCollectionType("drafts")}
            className="profile_collection_select_list_item"
          >
            DRAFTS
          </li>
          <li
            onClick={() => setCollectionType("wishlist")}
            className="profile_collection_select_list_item"
          >
            WISHLIST
          </li>
        </ul>
      </div> */}

      <div className="profile_collection">
        {typeCollectionSelected.toLowerCase() === "drafts".toLowerCase() && (
          <div
            onClick={() => navigate(`/profile/${id}/compose`)}
            className="profile_collection_create_tale_button"
          >
            <p>Create New Tale</p>
            <div className="profile_collection_create_tale_button_backdrop">
              <i className="fa-solid fa-plus"></i>
            </div>
          </div>
        )}
        {filteredCollection.length > 0 ? (
          filteredCollection.map((tale) => (
            <CollectionItem clickHandler={() => navigateToEdit(tale.ID)} tale={tale} />
          ))
        ) : (
          <h4 className="profile_collection_empty">
            No items found under "{typeCollectionSelected}"
          </h4>
        )}
      </div>
    </div>
  );
};

export default ProfileCollection;
