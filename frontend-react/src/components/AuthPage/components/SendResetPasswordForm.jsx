import React, { useState } from "react";
import "./SendResetPasswordForm.css";
import { useSiteState } from "../../../context/SiteStateContext";

const SendResetPasswordForm = () => {
  const { closeAuthModal, errorState, sendResetPasswordLink, openAuthModalLogin } = useSiteState();

  const [email, setEmail] = useState("");

  const handleSendResetPasswordLink = async (e) => {
    e.preventDefault();
    const linkSent = await sendResetPasswordLink(email);
    if (linkSent) {
      setEmail("");
      closeAuthModal();
    }
  };

  return (
    <form onSubmit={(e) => handleSendResetPasswordLink(e)} className="send_reset_password_form">
      <div className="send_reset_password_form_element">
        <p className="send_reset_password_form_text">
          Forgot your password? Please enter your email address that you used to create the account,
          we will send an link to your mail from where you can reset your password
        </p>
      </div>
      <div className="send_reset_password_form_element">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="send_reset_password_form_element_input"
          type="text"
          placeholder="Enter email address"
        />
      </div>
      <div onClick={() => openAuthModalLogin()} className="send_reset_password_form_back_login">
        Back to Login?
      </div>
      <button
        className={`send_reset_password_form_element_button ${
          errorState && "send_reset_password_form_element_button_error"
        }`}
        type="submit"
      >
        send link
      </button>
    </form>
  );
};

export default SendResetPasswordForm;
