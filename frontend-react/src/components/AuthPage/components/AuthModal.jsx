import React, { useState } from "react";
import "./AuthModal.css";
import { useSiteState } from "../../../context/SiteStateContext";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

const AuthModal = () => {
  const { authModalType, errorState } = useSiteState();

  return (
    <div
      style={authModalType === "register" ? { height: "35rem" } : { height: "25rem" }}
      className={`auth_modal ${errorState && "autho_modal_error"}`}
    >
      <div className="auth_modal_title">
        <p>{authModalType}</p>
        <svg
          className="auth_modal_svg"
          viewBox="0 0 1440 480"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className={`auth_modal_waveform ${errorState && "auth_modal_waveform_error"}`}
            d="M0,96L60,96C120,96,240,96,360,112C480,128,600,160,720,184C840,208,960,224,1080,224C1200,224,1320,208,1440,184C1560,160,1680,128,1800,144C1920,160,2040,224,2160,264C2280,304,2400,320,2520,320C2640,320,2760,304,2880,248C3000,192,3120,96,3240,72C3360,48,3480,96,3600,152C3720,208,3840,272,3960,256C4080,240,4200,144,4320,160C4440,176,4560,304,4680,344C4800,384,4920,336,5040,288C5160,240,5280,192,5400,184C5520,176,5640,208,5760,192C5880,176,6000,112,6120,120C6240,128,6360,208,6480,272C6600,336,6720,384,6840,392C6960,400,7080,368,7200,336C7320,304,7440,272,7560,248C7680,224,7800,208,7920,168C8040,128,8160,64,8280,48C8400,32,8520,64,8580,80L8640,96L8640,480L8580,480C8520,480,8400,480,8280,480C8160,480,8040,480,7920,480C7800,480,7680,480,7560,480C7440,480,7320,480,7200,480C7080,480,6960,480,6840,480C6720,480,6600,480,6480,480C6360,480,6240,480,6120,480C6000,480,5880,480,5760,480C5640,480,5520,480,5400,480C5280,480,5160,480,5040,480C4920,480,4800,480,4680,480C4560,480,4440,480,4320,480C4200,480,4080,480,3960,480C3840,480,3720,480,3600,480C3480,480,3360,480,3240,480C3120,480,3000,480,2880,480C2760,480,2640,480,2520,480C2400,480,2280,480,2160,480C2040,480,1920,480,1800,480C1680,480,1560,480,1440,480C1320,480,1200,480,1080,480C960,480,840,480,720,480C600,480,480,480,360,480C240,480,120,480,60,480L0,480Z"
          ></path>
        </svg>
      </div>
      <div className={`auth_modal_form_container ${errorState && "auth_modal_form_error"}`}>
        {authModalType === "register" ? <RegisterForm /> : <LoginForm />}
      </div>
    </div>
  );
};

export default AuthModal;
