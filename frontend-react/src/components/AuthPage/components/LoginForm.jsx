import React, { useState } from "react";
import "./LoginForm.css";
import { useSiteState } from "../../../context/SiteStateContext";

const LoginForm = () => {
  const { closeAuthModal, loginUser, errorState, openAuthModalForgotPassword } = useSiteState();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const loggedSuccesfully = await loginUser(username, password);
    if (loggedSuccesfully) {
      closeAuthModal();
      setUsername("");
      setPassword("");
    } else {
      console.log("Unable to login");
    }
  };

  return (
    <form onSubmit={(e) => handleLoginSubmit(e)} className="login_form">
      <div className="login_form_element">
        <label className="login_form_element_label">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login_form_element_input"
          type="text"
        />
      </div>
      <div className="login_form_element">
        <label className="login_form_element_label">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login_form_element_input"
          type="password"
        />
      </div>

      <div
        onClick={() => openAuthModalForgotPassword()}
        className="login_form_forgot_password_text"
      >
        Forgto Password?
      </div>
      <button
        className={`login_form_element_button ${errorState && "login_form_element_button_error"}`}
        type="submit"
      >
        login
      </button>
    </form>
  );
};

export default LoginForm;
