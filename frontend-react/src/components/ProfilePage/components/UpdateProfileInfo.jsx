import React, { useEffect, useState } from "react";
import "./UpdateProfileInfo.css";
import { useSiteState } from "../../../context/SiteStateContext";

const UpdateProfileInfo = ({ type, inputState, changeState, setInputState, isToggled }) => {
  const { userLoggedIn, updateUserProfileInfo } = useSiteState();

  useEffect(() => {
    if (type === "username") {
      setInputState(userLoggedIn.username);
    } else {
      setInputState(userLoggedIn.email);
    }
  }, []);

  const cancelHandler = (e) => {
    e.preventDefault();
    if (type === "username") {
      setInputState(userLoggedIn.username);
    } else {
      setInputState(userLoggedIn.email);
    }
    changeState(false);
  };

  const updateHandler = (e) => {
    e.preventDefault();
    updateUserProfileInfo(userLoggedIn.id, { [type]: inputState });
    changeState(false);
  };

  return (
    <div className="update_profile_info">
      <form className="update_profile_info_form">
        <input
          className={`update_profile_info_input ${
            isToggled && "update_profile_info_input_selected"
          } ${type === "email" && "update_profile_email_font_size"}`}
          type="text"
          value={inputState}
          onChange={(e) => setInputState(e.target.value)}
        />
        <div className="update_profile_info_btns">
          <button
            onClick={updateHandler}
            className={`update_profile_info_btn_submit ${
              isToggled && "update_profile_info_btn_selected"
            }`}
            type="submit"
          >
            <i className="fa-solid fa-check"></i>
          </button>
          <button
            onClick={cancelHandler}
            className={`update_profile_info_btn_cancel ${
              isToggled && "update_profile_info_btn_selected"
            }`}
            type="submit"
          >
            <i className="fa-solid fa-ban"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfileInfo;
