import React, { useState } from "react";
import "./RegisterForm.css";
import { useSiteState } from "../../../context/SiteStateContext";

const RegisterForm = () => {
  const { closeAuthModal, registerUser, errorState } = useSiteState();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const handleRegisterForm = async (e) => {
    e.preventDefault();
    const registeredSuccesfully = await registerUser(username, email, password, confirmPassword);
    if (registeredSuccesfully) {
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setBirthDate("");
      closeAuthModal();
    } else {
      console.log("unable to register");
    }
  };

  return (
    <form onSubmit={handleRegisterForm} className="register_form">
      <div className="register_form_element">
        <label className="register_form_element_label">Username</label>
        <input
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          className="register_form_element_input"
          type="text"
        />
      </div>
      <div className="register_form_element">
        <label className="register_form_element_label">Email</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="register_form_element_input"
          type="email"
        />
      </div>
      <div className="register_form_element">
        <label className="register_form_element_label">Date of Birth</label>
        <input
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="register_form_element_input"
          type="date"
        />
      </div>
      <div className="register_form_element">
        <label className="register_form_element_label">Password</label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className="register_form_element_input"
          type="password"
        />
      </div>
      <div className="register_form_element">
        <label className="register_form_element_label"> Confirm Password</label>
        <input
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          className="register_form_element_input"
          type="password"
        />
      </div>
      <button
        className={`register_form_element_button ${
          errorState && "register_form_element_button_error"
        }`}
        type="submit"
      >
        register
      </button>
    </form>
  );
};

export default RegisterForm;
