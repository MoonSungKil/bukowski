import React, { useEffect, useState } from "react";
import "./ProfileCollection.css";
import CollectionItem from "./CollectionItem";
import { useProfileState } from "../../../context/ProfileStateContext";
import { useNavigate, useParams } from "react-router-dom";

const ProfileCollection = ({ keyword, setKeyword }) => {
  const { typeCollectionSelected, filteredCollection, filterCollectionByKeyword } =
    useProfileState();

  const { username } = useParams();

  const submitHandler = (e) => {
    e.preventDefault();
    filterCollectionByKeyword(keyword);
  };

  useEffect(() => {
    filterCollectionByKeyword(keyword);
  }, [keyword]);

  const navigate = useNavigate();

  const navigateToEdit = (taleId) => {
    if (typeCollectionSelected.toLowerCase() === "drafts".toLowerCase()) {
      navigate(`/profile/${username}/edit/${taleId}`);
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
      <div className="profile_collection">
        {typeCollectionSelected.toLowerCase() === "drafts".toLowerCase() && (
          <div
            onClick={() => navigate(`/profile/${username}/compose`)}
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
