import React, { useRef, useState } from "react";
import "./ProfileInfoBox.css";
import { useSiteState } from "../../../context/SiteStateContext";
import ProfileSettingsInfo from "./ProfileSettingsInfo";
import UpdateProfileInfo from "./UpdateProfileInfo";
import UpdateProfilePassword from "./UpdateProfilePassword";
import { useProfileState } from "../../../context/ProfileStateContext";
import DeleteAccount from "./DeleteAccount";

const ProfileInfoBox = ({ setKeyword }) => {
  const { userLoggedIn, updateUserProfilePicture } = useSiteState();

  const inputRef = useRef();
  const [file, setFile] = useState(null);

  const profilePicture = userLoggedIn.profile_picture;

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

  const [deleteAccountToggle, setDeleteAccountToggle] = useState(false);

  const togglePasswordChange = () => {
    setDeleteAccountToggle(false);
    setSelectedPassword(!selectedPassword);
  };

  const toggleDeleteAccount = () => {
    setSelectedPassword(false);
    setDeleteAccountToggle(!deleteAccountToggle);
  };

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const toggleState = (state, setState, actualInput, setInput) => {
    setState(!state);
    setInput(actualInput);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="profile_info_box_container">
      <div className="profile_info_box">
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
          <UpdateProfileInfo
            type={"email"}
            inputState={email}
            setInputState={setEmail}
            isToggled={selectedEmail}
            changeState={setSelectedEmail}
          />
        </div>
        {selectedPassword && <UpdateProfilePassword changeState={setSelectedPassword} />}
        {deleteAccountToggle && <DeleteAccount />}
        <ul className="profile_info_box_settings_list">
          <li
            onClick={() =>
              toggleState(selectedUsername, setSelectedUsername, userLoggedIn.username, setUsername)
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
          <li onClick={() => togglePasswordChange()} className="profile_info_box_settings_item">
            <i className="fa-solid fa-lock">
              <ProfileSettingsInfo text={"update password"} />
            </i>
          </li>
          <li onClick={() => toggleDeleteAccount()} className="profile_info_box_settings_item">
            <i className="fa-solid fa-skull">
              <ProfileSettingsInfo text={"delete account"} />
            </i>
          </li>
        </ul>
        <div className="profile_info_box_joined">
          Joined: <span>{formatDate(userLoggedIn.created_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoBox;
