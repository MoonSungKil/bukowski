import React from "react";
import "./RegisterForm.css";

const RegisterForm = () => {
  return (
    <form className="register_form">
      <div className="register_form_element">
        <label className="register_form_element_label">First Name</label>
        <input className="register_form_element_input" type="text" />
      </div>
      <div className="register_form_element">
        <label className="register_form_element_label">Last Name</label>
        <input className="register_form_element_input" type="text" />
      </div>
      <div className="register_form_element">
        <label className="register_form_element_label">Email</label>
        <input className="register_form_element_input" type="email" />
      </div>
      <div className="register_form_element">
        <label className="register_form_element_label">Date of Birth</label>
        <input className="register_form_element_input" type="date" />
      </div>
      <div className="register_form_element">
        <label className="register_form_element_label">Password</label>
        <input className="register_form_element_input" type="password" />
      </div>
      <div className="register_form_element">
        <label className="register_form_element_label"> Confirm Password</label>
        <input className="register_form_element_input" type="password" />
      </div>
      <button className="register_form_element_button" type="submit">
        register
      </button>
    </form>
  );
};

export default RegisterForm;
