import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer_top">
        <div className="footer_top_media">
          <div className="footer_top_media_icon">
            <i className="fa-brands fa-facebook-f"></i>
          </div>
          <div className="footer_top_media_icon">
            <i className="fa-brands fa-instagram"></i>
          </div>
          <div className="footer_top_media_icon">
            <i className="fa-brands fa-discord"></i>
          </div>
          <div className="footer_top_media_icon">
            <i className="fa-brands fa-twitter"></i>
          </div>
        </div>
      </div>
      <div className="footer_bottom">
        <div className="footer_bottom_text">
          <h3>Bukowski - only for storytellers, authors and dreamers</h3>
        </div>
        <div className="footer_bottom_rights">
          © 2025 Bukowski. All rights reserved. Unauthorized reproduction or distribution of content
          is strictly prohibited.
        </div>
      </div>
      <a href="#header" className="footer_carret">
        <i className="fa-solid fa-caret-up"></i>
      </a>
    </div>
  );
};

export default Footer;
