import React, { useRef } from "react";
import "./SinglePageTop.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSiteState } from "../../../context/SiteStateContext";
import Rating from "./Rating";

const SinglePageTop = ({ tale, view }) => {
  const {
    isPurchasedorPublished,
    purchaseTaleById,
    addTaleToWishlist,
    removeTaleFromWishlist,
    wishlist,
  } = useSiteState();

  const { id } = useParams();

  const [purchased, setPurchased] = useState(false);
  useEffect(() => {
    const checkPurchasedStatus = async () => {
      const result = await isPurchasedorPublished(id); // wait for the async function
      setPurchased(result);
    };

    checkPurchasedStatus();
  }, [id, isPurchasedorPublished]);

  const [purchaseBox, setPurchaseBox] = useState(false);

  const handlePurchaseTale = async () => {
    const purchasedSuccesfully = await purchaseTaleById(id);
    setPurchaseBox(false);
    // if (purchasedSuccesfully) {
    //   setTimeout(() => {
    //     window.location.reload();
    //   }, 1000);
    // }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  const taleImage = tale && tale.tale_image;

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const taleRef = useRef(null);

  const handleMouseMove = (e) => {
    if (taleRef.current) {
      const rect = taleRef.current.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.bottom });
    }
  };

  const [enableRating, setEnableRating] = useState(false);

  if (!tale) {
    return <div>Loading</div>;
  }

  let starRatings = [];
  if (tale) {
    for (let i = 0; i < Math.floor(tale.rating); i++) {
      starRatings.push(<i className="fa-solid fa-star rating_star"></i>);
    }
  }
  if (!Number.isInteger(tale.rating)) {
    starRatings.push(<i className="fa-solid fa-star rating_star_faded"></i>);
  }

  return (
    <div className="single_page_head">
      <div className="single_page_head_top">
        <div className="single_page_head_top_left">
          <div className="single_page_head_top_image_wrapper">
            {wishlist.some((tale) => tale.ID === Number(id)) && (
              <div className="single_page_head_top_wishlist_banner">
                <i className="fa-solid fa-bookmark"></i>
              </div>
            )}
            <img className="single_page_cover" src={taleImage} alt="cover_picture" />
            {view === "purchased" && (
              <div
                onClick={() => setEnableRating(!enableRating)}
                className="single_page_head_top_image_backdrop"
              >
                <p>Click to Rate</p>
                <i className="fa-solid fa-caret-down"></i>
              </div>
            )}
          </div>
          {view === "purchased" && enableRating ? (
            <Rating tale={tale} setEnableRating={setEnableRating} />
          ) : (
            <div
              onMouseEnter={() => setHover(true)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHover(false)}
              ref={taleRef}
              className="single_page_head_top_stats_rating"
            >
              {hover && (
                <div
                  style={{
                    top: `${position.y}px`,
                    left: `${position.x}px`,
                  }}
                  className="rating_digit"
                >
                  {tale.rating.toFixed(1)}
                </div>
              )}
              {starRatings.length > 0 ? (
                starRatings
              ) : (
                <div className="rating_still_not_rated"> No ratings available</div>
              )}
            </div>
          )}
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
                  onClick={() => setPurchaseBox(!purchaseBox)}
                  className="single_page_head_top_stats_bottom_buy"
                >
                  ${tale && tale.price}
                  <br />
                  Buy Now
                </div>
                {wishlist.some((tale) => tale.ID === Number(id)) ? (
                  <div
                    onClick={() => removeTaleFromWishlist(id)}
                    className="single_page_head_top_stats_bottom_cart"
                  >
                    Remove from
                    <br />
                    Wishlist
                  </div>
                ) : (
                  <div
                    onClick={() => addTaleToWishlist(id)}
                    className="single_page_head_top_stats_bottom_cart"
                  >
                    Add to
                    <br />
                    Wishlist
                  </div>
                )}
                <div
                  className={`single_page_top_purchase_box ${
                    purchaseBox && "purchase_box_display"
                  }`}
                >
                  <p className="single_page_purchase_box_text">
                    Click "Purchase" to purchase authorize payment.
                  </p>
                  <div className="single_page_purchase_box_buttons">
                    <div
                      onClick={() => handlePurchaseTale(id)}
                      className="single_page_purchase_submit_btn"
                    >
                      Purchase
                    </div>
                    <div
                      onClick={() => setPurchaseBox(false)}
                      className="single_page_purchase_cancel_btn"
                    >
                      Cancel
                    </div>
                  </div>
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
