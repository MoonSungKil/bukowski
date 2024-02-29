import React from "react";
import "./MainThreadSuggestion.css";
import ThreadBox from "./ThreadBox";

const MainThreadSuggestion = () => {
  return (
    <div className="main_thread_suggestion">
      <h1>Thread Topic Suggestions!</h1>
      <h2>
        Join our <a href="/forum">FORUM</a> and engage the vibrant exchange of ideas, opinions, and
        perspectives in our forum section. Engage in discussions, debates, and arguments that foster
        intellectual growth and deepen understanding.
      </h2>
      <div className="main_thread_suggestion_previews">
        <div className="main_thread_suggestion_previews_one">
          <ThreadBox />
        </div>
        <div className="main_thread_suggestion_previews_two">
          <ThreadBox />
        </div>
      </div>
    </div>
  );
};

export default MainThreadSuggestion;
