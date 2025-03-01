import React from "react";
import "./UnsubscribeNewsletter.css";
import { useSiteState } from "../../context/SiteStateContext";
import { useNavigate, useSearchParams } from "react-router-dom";

const UnsubscribeNewsletter = () => {
  const { unsubscribeNewsletter } = useSiteState();

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await unsubscribeNewsletter(email);
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
    <div className="unsubscribe_newsletter_container">
      <form onSubmit={(e) => handleSubmit(e)} className="unsubscribe_newsletter_form">
        <p>Click "Unsubscribe" to not recieve any more newsletter</p>
        <button className="unsubscribe_newsletter_form_submit">Unsubscribe</button>
      </form>
    </div>
  );
};

export default UnsubscribeNewsletter;
