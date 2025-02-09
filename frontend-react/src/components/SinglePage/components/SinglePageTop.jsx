import React from "react";
import "./SinglePageTop.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSiteState } from "../../../context/SiteStateContext";

const SinglePageTop = ({ tale }) => {
  const { isPurchasedorPublished, purchaseTaleById, published, archiveTale } = useSiteState();

  const { id } = useParams();

  const [purchased, setPurchased] = useState(false);
  useEffect(() => {
    const checkPurchasedStatus = async () => {
      const result = await isPurchasedorPublished(id); // wait for the async function
      setPurchased(result);
    };

    checkPurchasedStatus();
  }, [id, isPurchasedorPublished]);

  const handlePurchaseTale = () => {
    purchaseTaleById(tale.id);
  };

  const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  const taleImage = tale && `${backendURL}${tale.tale_image}`;

  if (!tale) {
    return <div>Loading</div>;
  }

  return (
    <div className="single_page_head">
      <div className="single_page_head_top">
        <div className="single_page_head_top_left">
          <div className="single_page_head_top_image_wrapper">
            <img className="single_page_cover" src={taleImage} alt="cover_picture" />
          </div>
          <div className="single_page_head_top_stats_rating">
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
          </div>
        </div>
        <div className="single_page_head_top_stats">
          <div className="single_page_head_top_title">{tale.title}</div>
          <div className="single_page_head_top_stats_preview">
            <p>{tale.description}</p>
            <div className="single_page_head_top_stats_preview_shadow"></div>
          </div>
          <div className="single_page_head_top_stats_bottom">
            {purchased ? (
              <a
                href="#single_page_content"
                className="single_page_head_top_stats_bottom_scroll_down"
              >
                <p>Scroll Down to Content</p>
                <i className="fa-solid fa-arrow-down"></i>
              </a>
            ) : (
              <div className="single_page_head_top_stats_bottom_purchase">
                <div
                  onClick={() => handlePurchaseTale()}
                  className="single_page_head_top_stats_bottom_buy"
                >
                  ${tale && tale.price}
                  <br />
                  Buy Now
                </div>
                <div className="single_page_head_top_stats_bottom_cart">
                  Add to
                  <br />
                  Cart
                </div>
              </div>
            )}
            <div className="single_page_head_top_genres">
              {tale.genres.map((genre) => {
                return (
                  <p
                    className={`single_page_head_top_genre genre_type_name_${genre.name
                      .toLowerCase()
                      .replace(/[\/\-]/g, "_")}`}
                  >
                    {genre.name}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePageTop;
