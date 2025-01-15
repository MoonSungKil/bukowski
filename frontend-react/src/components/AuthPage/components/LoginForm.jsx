import React, { useState } from "react";
import "./LoginForm.css";
import { useUser } from "../../../context/UserContext";
import { useSiteState } from "../../../context/SiteStateContext";

const LoginForm = () => {
  const { closeAuthModal, loginUser } = useSiteState();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const loggedSuccesfully = await loginUser(email, password);
    if (loggedSuccesfully) {
      closeAuthModal();
      setEmail("");
      setPassword("");
    } else {
      setError("Invalid username or password");
      setTimeout(() => {
        setError("");
      }, 2500);
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
      <div className="login_form_element_error">{error}</div>
      <button className="login_form_element_button" type="submit">
        login
      </button>
    </form>
  );
};

export default LoginForm;
