import React, { useRef, useState } from "react";
import "./ProfileInfoBox.css";
import { useSiteState } from "../../../context/SiteStateContext";
import ProfileSettingsInfo from "./ProfileSettingsInfo";
import UpdateProfileInfo from "./UpdateProfileInfo";
import UpdateProfilePassword from "./UpdateProfilePassword";
import { useProfileState } from "../../../context/ProfileStateContext";

const ProfileInfoBox = () => {
  const { userLoggedIn, updateUserProfilePicture } = useSiteState();
  const { selectedCollectionType } = useProfileState();

  const setCollectionType = (collectionType) => {
    selectedCollectionType(collectionType.toLowerCase());
  };

  const inputRef = useRef();
  const [file, setFile] = useState(null);

  const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  const profilePicture = `${backendURL}${userLoggedIn.profile_picture}`;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleFileUpload = (e) => {
    updateUserProfilePicture(file, userLoggedIn.id);
    setFile(null);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  const [selectedEmail, setSelectedEmail] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const toggleState = (state, setState, actualInput, setInput) => {
    setState(!state);
    setInput(actualInput);
  };
  return (
    <div className="profile_info_box_container">
      <div className="profile_info_box">
        <div className="profile_info_box_header">
          <div className="profile_info_box_image">
            <img src={profilePicture} alt="profile_picture" />
            {!file && (
              <div onClick={onChooseFile} className="profile_info_box_image_backdrop">
                <i className="fa-solid fa-plus"></i>
                <input type="file" onChange={handleFileChange} ref={inputRef} />
              </div>
            )}
            {file && (
              <div className="profile_picture_upload_container">
                <div onClick={handleFileUpload} className="profile_picture_upload_btn">
                  Upload
                  <i className="fa-solid fa-upload"></i>
                </div>
                <div onClick={() => setFile(null)} className="profile_picture_delete_btn">
                  Delete
                  <i className="fa-solid fa-trash"></i>
                </div>
              </div>
            )}
          </div>
          <div className="profile_info_box_settings">
            <UpdateProfileInfo
              type={"username"}
              inputState={username}
              setInputState={setUsername}
              isToggled={selectedUsername}
              changeState={setSelectedUsername}
            />

            <ul className="profile_info_box_settings_list">
              <li
                onClick={() =>
                  toggleState(
                    selectedUsername,
                    setSelectedUsername,
                    userLoggedIn.username,
                    setUsername
                  )
                }
                className="profile_info_box_settings_item"
              >
                <p className="fa-solid fa-user">
                  <ProfileSettingsInfo text={"update username"} />
                </p>
              </li>
              <li
                onClick={() =>
                  toggleState(selectedEmail, setSelectedEmail, userLoggedIn.email, setEmail)
                }
                className="profile_info_box_settings_item"
              >
                <i className="fa-solid fa-envelope">
                  <ProfileSettingsInfo text={"update email address"} />
                </i>
              </li>
              <li
                onClick={() => setSelectedPassword(!selectedPassword)}
                className="profile_info_box_settings_item"
              >
                <i className="fa-solid fa-lock">
                  <ProfileSettingsInfo text={"update password"} />
                </i>
              </li>
              <li className="profile_info_box_settings_item">
                <i className="fa-solid fa-quote-left">
                  <ProfileSettingsInfo text={"update quote of the day"} />
                </i>
              </li>
              <li className="profile_info_box_settings_item">
                <i className="fa-solid fa-credit-card">
                  <ProfileSettingsInfo text={"update payment method"} />
                </i>
              </li>
            </ul>
          </div>
        </div>
        <UpdateProfileInfo
          type={"email"}
          inputState={email}
          setInputState={setEmail}
          isToggled={selectedEmail}
          changeState={setSelectedEmail}
        />
        {selectedPassword && <UpdateProfilePassword changeState={setSelectedPassword} />}
        <div className="profile_info_box_body">
          <ul className="profile_info_box_body_list">
            <li
              onClick={() => setCollectionType("published")}
              className="profile_info_box_body_item"
            >
              PUBLISHED
            </li>
            <li
              onClick={() => setCollectionType("purchased")}
              className="profile_info_box_body_item"
            >
              PURCHASES
            </li>
            <li onClick={() => setCollectionType("drafts")} className="profile_info_box_body_item">
              DRAFTS
            </li>
            <li
              onClick={() => setCollectionType("wishlist")}
              className="profile_info_box_body_item"
            >
              WISHLIST
            </li>
            <li onClick={() => setCollectionType("quotes")} className="profile_info_box_body_item">
              QUOTES
            </li>
            <li onClick={() => setCollectionType("cart")} className="profile_info_box_body_item">
              CART
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoBox;
