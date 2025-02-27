import "./Navigation.css";
import { useSiteState } from "../../../context/SiteStateContext";
import { ProfileIcon } from "./ProfileIcon";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import QuickFilteredTale from "./QuickFilteredTale";

const Navigation = () => {
  const {
    openAuthModalRegister,
    openAuthModalLogin,
    userLoggedIn,
    quickFilterTale,
    quickFilteredTales,
  } = useSiteState();

  const [keyword, setKeyword] = useState("");
  const inputRef = useRef(null);

  const handleClickOutside = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setKeyword("");
    }
  };

  const quickSearch = (e) => {
    setKeyword(e.target.value);
    quickFilterTale(keyword);
  };

  useEffect(() => {
    quickFilterTale(keyword);
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [keyword]);

  const handleScroll = () => {
    setTimeout(() => {
      const element = document.getElementById("main_page_body_container");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 200);
  };

  return (
    <div className="navigation_container">
      <div className="navigation_top_section">
        <div ref={inputRef} className="navigation_search_box">
          <input
            value={keyword}
            onChange={(e) => quickSearch(e)}
            type="text"
            placeholder="Search for Book"
          />
          <div className="navigation_search_box_filtered_tales">
            {quickFilteredTales.length > 0 &&
              quickFilteredTales.map((tale) => (
                <QuickFilteredTale tale={tale} setKeyword={setKeyword} />
              ))}
          </div>
        </div>
        <div className="navigation_auth_box">
          {userLoggedIn.username ? (
            <ProfileIcon />
          ) : (
            <>
              <div
                onClick={() => openAuthModalLogin()}
                className="navigation_auth_login navigation_auth_btn"
              >
                <p className="navigation_auth_btn_text">Log In</p>
              </div>
              <div
                onClick={() => openAuthModalRegister()}
                className="navigation_auth_register navigation_auth_btn"
              >
                <p className="navigation_auth_btn_text">Register</p>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="navigation_text">
        Visit our{" "}
        <Link to={"/"} onClick={handleScroll} className="navigation_text_link">
          library.
        </Link>{" "}
        To explore a new stories, browse our curated selection of tales or sing up to craft your own
        adventures.
      </div>
    </div>
  );
};

export default Navigation;
