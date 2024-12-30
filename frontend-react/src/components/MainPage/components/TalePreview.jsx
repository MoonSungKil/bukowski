import React, { useState } from "react";
import "./TalePreview.css";
import PercentageBar from "./PercentageBar";
import { useNavigate } from "react-router-dom";

const TalePreview = ({ tale }) => {
  const [showPreview, setShowPreview] = useState(false);

  const navigate = useNavigate();

  const navigateToTale = () => {
    navigate(`/tale/${tale.ID}`);
  };

  return (
    <div
      onClick={navigateToTale}
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
      className="tale_preview"
    >
      <div className={`tale_previeew_inside ${showPreview && "tale_previeew_inside_show"}`}>
        <PercentageBar title="Writting" percentage="9" />
        <PercentageBar title="Plot" percentage="6" />
        <PercentageBar title="Pacing" percentage="7" />
        <PercentageBar title="Originality" percentage="4" />
        <PercentageBar title="Profanity" percentage="10" />
      </div>
      <div className="tale_preview_main">
        <div className="tale_preview_add_cart">
          <i className="fa-solid fa-cart-shopping"></i>
        </div>
      </div>
      <div className="tale_preview_title_container">
        <p className="tale_preview_title">{tale.title}</p>
        <svg className="tale_preview_svg" viewBox="0 0 1440 390" xmlns="http://www.w3.org/2000/svg">
          <path
            className="tale_preview_waveform"
            d="M0,49L60,81.7C120,114,240,180,360,204.2C480,229,600,212,720,196C840,180,960,163,1080,163.3C1200,163,1320,180,1440,187.8C1560,196,1680,196,1800,204.2C1920,212,2040,229,2160,220.5C2280,212,2400,180,2520,147C2640,114,2760,82,2880,122.5C3000,163,3120,278,3240,310.3C3360,343,3480,294,3600,261.3C3720,229,3840,212,3960,204.2C4080,196,4200,196,4320,196C4440,196,4560,196,4680,163.3C4800,131,4920,65,5040,81.7C5160,98,5280,196,5400,261.3C5520,327,5640,359,5760,334.8C5880,310,6000,229,6120,196C6240,163,6360,180,6480,155.2C6600,131,6720,65,6840,73.5C6960,82,7080,163,7200,204.2C7320,245,7440,245,7560,212.3C7680,180,7800,114,7920,114.3C8040,114,8160,180,8280,179.7C8400,180,8520,114,8580,81.7L8640,49L8640,490L8580,490C8520,490,8400,490,8280,490C8160,490,8040,490,7920,490C7800,490,7680,490,7560,490C7440,490,7320,490,7200,490C7080,490,6960,490,6840,490C6720,490,6600,490,6480,490C6360,490,6240,490,6120,490C6000,490,5880,490,5760,490C5640,490,5520,490,5400,490C5280,490,5160,490,5040,490C4920,490,4800,490,4680,490C4560,490,4440,490,4320,490C4200,490,4080,490,3960,490C3840,490,3720,490,3600,490C3480,490,3360,490,3240,490C3120,490,3000,490,2880,490C2760,490,2640,490,2520,490C2400,490,2280,490,2160,490C2040,490,1920,490,1800,490C1680,490,1560,490,1440,490C1320,490,1200,490,1080,490C960,490,840,490,720,490C600,490,480,490,360,490C240,490,120,490,60,490L0,490Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default TalePreview;
