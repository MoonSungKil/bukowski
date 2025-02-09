import React, { useState } from "react";
import "./UpdateProfilePassword.css";
import { useSiteState } from "../../../context/SiteStateContext";

const UpdateProfilePassword = ({ changeState }) => {
  const { userLoggedIn, updateProfilePassword } = useSiteState();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updateHandler = async (e) => {
    e.preventDefault();
    const passwordData = {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_new_password: confirmPassword,
    };
    const isPasswordUpdated = await updateProfilePassword(userLoggedIn.id, passwordData);
    if (isPasswordUpdated) {
      changeState(false);
    }
  };

  const cancelHandler = (e) => {
    e.preventDefault();
    changeState(false);
  };

  return (
    <div className="update_profile_password">
      <form className="update_profile_password_form">
        <label htmlFor="current_password">Current Password</label>
        <input
          onChange={(e) => setCurrentPassword(e.target.value)}
          type="password"
          name="current_password"
        />
        <label htmlFor="confirm_password">New Password</label>
        <input
          onChange={(e) => setNewPassword(e.target.value)}
          type="password"
          name="new_password"
        />
        <label htmlFor="new_password">Confirm Password</label>
        <input
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          name="confirm_password"
        />
        <div className="update_password_btns">
          <button
            onClick={(e) => updateHandler(e)}
            className="update_password_submit"
            type="submit"
          >
            Submit
          </button>
          <button
            onClick={(e) => cancelHandler(e)}
            className="update_password_cancel"
            type="submit"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfilePassword;
