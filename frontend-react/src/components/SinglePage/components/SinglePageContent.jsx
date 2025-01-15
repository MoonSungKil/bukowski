import "./SinglePageContent.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSiteState } from "../../../context/SiteStateContext";

const SinglePageContent = () => {
  const { isPurchased, singleTaleSelected } = useSiteState();

  const { id } = useParams();

  const [purchased, setPurchased] = useState(false);
  useEffect(() => {
    const checkPurchasedStatus = async () => {
      const result = await isPurchased(id); // wait for the async function
      setPurchased(result);
    };

    checkPurchasedStatus();
  }, [id, isPurchased]);

  console.log(purchased + "here" + singleTaleSelected);
  return (
    <div className="single_page_content_container">
      <div className="single_page_content">
        {purchased ? (
          <>
            <div className="single_page_content_title_author">
              {singleTaleSelected.title} by {singleTaleSelected.author}
            </div>
            <div className="single_page_content_underline"></div>
            <p className="single_page_content_story">{singleTaleSelected.content}</p>
          </>
        ) : (
          <div className="single_page_content_locked">
            <div className="single_page_content_locked_text">
              <i className="fa-solid fa-lock"></i>
              <p>Purchase to Unlock Content</p>
            </div>
            <svg
              className="single_page_content_svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
            >
              <path
                className="single_page_content_waveform"
                d="M1440,21.2101911 L1440,120 L0,120 L0,21.2101911 C120,35.0700637 240,42 360,42 C480,42 600,35.0700637 720,21.2101911 C808.32779,12.416393 874.573633,6.87702029 918.737528,4.59207306 C972.491685,1.8109458 1026.24584,0.420382166 1080,0.420382166 C1200,0.420382166 1320,7.35031847 1440,21.2101911 Z"
              ></path>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePageContent;
