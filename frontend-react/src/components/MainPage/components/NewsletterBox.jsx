import React, { useState } from "react";
import "./NewsletterBox.css";
import { useSiteState } from "../../../context/SiteStateContext";

const NewsletterBox = () => {
  const { SubscribeNewsletter } = useSiteState();

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    SubscribeNewsletter(email);
    console.log(email);
  };

  return (
    <div className="newsletter_container">
      <div className="newsletter">
        <div className="newsletter_title">
          <p>Join our amazing</p>
          <h2>Newsletter</h2>
          <p>We promise you'll love it!</p>
        </div>
        <form onSubmit={(e) => handleSubmit(e)} className="newsletter_form">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Enter email address"
          />
          <button type="submit">Subscribe</button>
        </form>
      </div>
      {/* <svg className="newsletter_svg" viewBox="0 0 480 480" xmlns="http://www.w3.org/2000/svg">
        <path
          className="newsletter_waveform"
          d="M423.5,271.5Q392,303,395.5,351Q399,399,359,414.5Q319,430,279.5,436.5Q240,443,205.5,424.5Q171,406,124,404.5Q77,403,63.5,361Q50,319,43,279.5Q36,240,53.5,205Q71,170,104.5,154Q138,138,143,78.5Q148,19,194,56Q240,93,282.5,64Q325,35,341,79Q357,123,394.5,142Q432,161,443.5,200.5Q455,240,423.5,271.5Z"
        />
      </svg>
      <svg
        className="newsletter_svg_inner"
        viewBox="0 0 480 480"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="newsletter_waveform_inner"
          d="M423.5,271.5Q392,303,395.5,351Q399,399,359,414.5Q319,430,279.5,436.5Q240,443,205.5,424.5Q171,406,124,404.5Q77,403,63.5,361Q50,319,43,279.5Q36,240,53.5,205Q71,170,104.5,154Q138,138,143,78.5Q148,19,194,56Q240,93,282.5,64Q325,35,341,79Q357,123,394.5,142Q432,161,443.5,200.5Q455,240,423.5,271.5Z"
        />
      </svg> */}
    </div>
  );
};

export default NewsletterBox;
