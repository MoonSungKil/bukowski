import React from "react";
import "./LoginForm.css";

const LoginForm = () => {
  return (
    <form className="login_form">
      <div className="login_form_element">
        <label className="login_form_element_label">Email</label>
        <input className="login_form_element_input" type="email" />
      </div>
      <div className="login_form_element">
        <label className="login_form_element_label"> Confirm Password</label>
        <input className="login_form_element_input" type="password" />
      </div>
      <button className="login_form_element_button" type="submit">
        login
      </button>
    </form>
  );
};

export default LoginForm;
