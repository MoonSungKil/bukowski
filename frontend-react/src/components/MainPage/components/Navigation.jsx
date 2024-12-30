import "./Navigation.css";
import { useSiteState } from "../../../context/SiteStateContext";
import { ProfileIcon } from "./ProfileIcon";
import { useUser } from "../../../context/UserContext";

const Navigation = () => {
  const { openAuthModalRegister, openAuthModalLogin } = useSiteState();

  const { userLoggedIn } = useUser();

  return (
    <div className="navigation_container">
      <div className="navigation_top_section">
        <div className="navigation_search_box">
          <input type="text" placeholder="Search for Book" />
        </div>
        <div className="navigation_auth_box">
          {userLoggedIn.username ? (
            <ProfileIcon user={userLoggedIn} />
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
      <div className="navigation_bottom_section">
        <ul className="navigation_genres_field">
          <li className="navigation_genres_item">Horror</li>
          <li className="navigation_genres_item">Romance</li>
          <li className="navigation_genres_item">Poetry</li>
          <li className="navigation_genres_item">Fiction</li>
          <li className="navigation_genres_item">Fantasy</li>
          <li className="navigation_genres_item">Short Story</li>
          <li className="navigation_genres_item">Adventure</li>
          <li className="navigation_genres_item">Biography</li>
          <li className="navigation_genres_item">History</li>
          <li className="navigation_genres_item">Realism</li>
          <li className="navigation_genres_item">Philosophy</li>
          <li className="navigation_genres_item">Psychology</li>
          <li className="navigation_genres_item">More</li>
        </ul>
      </div>
    </div>
  );
};

export default Navigation;
