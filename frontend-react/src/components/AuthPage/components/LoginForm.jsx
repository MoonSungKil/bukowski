import React, { useState } from "react";
import "./LoginForm.css";
import { useSiteState } from "../../../context/SiteStateContext";

const LoginForm = () => {
  const { closeAuthModal, loginUser, errorState } = useSiteState();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const loggedSuccesfully = await loginUser(email, password);
    if (loggedSuccesfully) {
      closeAuthModal();
      setEmail("");
      setPassword("");
    } else {
      console.log("Unable to login");
    }
  };

  return (
    <form onSubmit={(e) => handleLoginSubmit(e)} className="login_form">
      <div className="login_form_element">
        <label className="login_form_element_label">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
