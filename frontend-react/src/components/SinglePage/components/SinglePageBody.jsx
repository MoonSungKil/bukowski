import React from "react";
import "./SinglePageBody.css";
import bookImg from "../../../assets/cover/soul.jpg";
import PercentageBar from "../../MainPage/components/PercentageBar";

const SinglePageBody = () => {
  return (
    <div className="single_page_body">
      <div className="single_page_body_top">
        <div className="single_page_body_top_image">
          <div className="single_page_body_top_image_wrapper">
            <img className="single_page_cover" src={bookImg} alt="cover_picture" />
          </div>
        </div>
        <div className="single_page_body_top_divider"></div>
        <div className="single_page_body_top_stats">
          <div className="single_page_body_top_stats_rating">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>
          <div className="single_page_body_top_stats_preview">
            In a quiet town nestled between rolling hills, twenty-three-year-old Eleanor Bennett
            stumbles upon a faded journal tucked away in the dusty corner of her grandmother's
            attic. What starts as a simple curiosity soon becomes an obsession, as the journal’s
            entries, penned in an elegant and delicate hand, recount a love story that transcends
            time. The pages speak of two souls bound by an inexplicable and mystical connection,
            their fates intertwined across lifetimes. As Eleanor delves deeper, she begins to notice
            unsettling parallels between the lives described in the journal and her own. Memories
            she doesn’t recall experiencing begin to surface, and strange coincidences, like places
            she’s never been yet somehow recognizes, pull her further into the mystery. Her nights
            are haunted by vivid, recurring dreams of faces she cannot name and events she feels she
            should remember. The line between her world and the one within the journal begins to
            blur, leaving her to question her own reality. Guided by the journal’s secrets, Eleanor
            embarks on a journey that takes her from the quiet safety of her hometown to forgotten
            archives, ancient ruins, and unexpected encounters. Along the way, she discovers
            fragments of a past that feels all too familiar, as though it belongs not to a stranger
            but to her. Every clue unravels another layer of the mystery, revealing truths about
            love, loss, and the unseen forces that shape our destinies. As the pieces fall into
            place, Eleanor must decide if she will embrace the path the journal sets before her or
            forge a new destiny of her own. What she uncovers may change her life forever—or lead
            her to a choice that binds her soul to a fate she cannot escape.
            <div className="single_page_body_top_stats_preview_shadow"></div>
          </div>
          <div className="single_page_body_top_stats_bottom">
            <div className="single_page_body_top_stats_bottom_buy">
              $12.99
              <br />
              Buy Now
            </div>
            <div className="single_page_body_top_stats_bottom_cart">
              Add to
              <br />
              Cart
            </div>
            <div className="single_page_body_top_stats_bottom_stats">
              <PercentageBar title="Writting" percentage="9" />
              <PercentageBar title="Plot" percentage="6" />
              <PercentageBar title="Pacing" percentage="7" />
              <PercentageBar title="Originality" percentage="4" />
              <PercentageBar title="Profanity" percentage="10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePageBody;
