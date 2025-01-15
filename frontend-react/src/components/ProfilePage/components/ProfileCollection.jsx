import React, { useState } from "react";
import "./ProfileCollection.css";
import CollectionItem from "./CollectionItem";
import { useProfileState } from "../../../context/ProfileStateContext";
import CreateTale from "./CreateTale";

const ProfileCollection = () => {
  const {
    typeCollectionSelected,
    filteredCollection,
    selectedCollectionType,
    toggleCreateTaleModalState,
    createTaleModalState,
  } = useProfileState();

  const [inputValue, setInputValue] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    selectedCollectionType(typeCollectionSelected.toLowerCase());
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
              type="text"
              placeholder="Search for book"
              className="profile_collection_search_input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className="profile_collection_search_button">
              +
            </button>
          </form>
        </div>
      </div>
      {/* <div className="profile_collection_create_tale"></div>
       */}
      {createTaleModalState ? (
        <CreateTale />
      ) : (
        <div className="profile_collection">
          {typeCollectionSelected.toLowerCase() === "drafts".toLowerCase() && (
            <div
              onClick={() => toggleCreateTaleModalState()}
              className="profile_collection_create_tale_button"
            >
              <p>Create New Tale</p>
              <div className="profile_collection_create_tale_button_backdrop">
                <i className="fa-solid fa-plus"></i>
              </div>
            </div>
          )}
          {filteredCollection.length > 0 ? (
            filteredCollection.map((tale) => <CollectionItem title={tale.title} />)
          ) : (
            <h4 className="profile_collection_empty">
              No items found under "{typeCollectionSelected}"
            </h4>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileCollection;
