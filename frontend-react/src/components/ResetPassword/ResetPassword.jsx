import React, { useState } from "react";
import "./ResetPassword.css";
import { useSiteState } from "../../context/SiteStateContext";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const { resetPassword } = useSiteState();

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await resetPassword(newPassword, confirmNewPassword, token);
    if (success) {
      setTimeout(() => {
        navigate("/");
      }, 2000);
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    }
  };

  return (
    <div className="reset_password_container">
      <form onSubmit={(e) => handleSubmit(e)} className="reset_passwrod_form">
        <div className="reset_password_form_element">
          <label htmlFor="new_password">New Password</label>
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            name="new_password"
            id=""
          />
        </div>
        <div className="reset_password_form_element">
          <label htmlFor="confirm_password">Confirm New Password</label>
          <input
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            type="password"
            name="confirm_password"
            id=""
          />
        </div>
        <button className="reset_password_form_submit">Submit</button>
      </form>
    </div>
  );
};

export default ResetPassword;
