import React from "react";
import "./Auth.css";
import AuthModal from "./components/AuthModal";
import { useSiteState } from "../../context/SiteStateContext";

const AuthPage = () => {
  const { closeAuthModal, authModalOpen } = useSiteState();

  const closingAuthModal = (e) => {
    e.stopPropagation();
    if (e.target.classList.contains("auth_show")) {
      closeAuthModal();
    }
  };
  return (
    <div onClick={closingAuthModal} className={`auth ${authModalOpen && "auth_show"}`}>
      <AuthModal />
    </div>
  );
};

export default AuthPage;
