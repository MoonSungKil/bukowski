import React from "react";
import "./MainThreadSuggestion.css";
import ThreadBox from "./ThreadBox";

const MainThreadSuggestion = () => {
  return (
    <div className="main_thread_suggestion">
      <div className="main_thread_suggestion_previews">
        <div className="main_thread_suggestion_previews_one">
          <ThreadBox
            title={"Write Your Masterpiece"}
            content={
              "Your stories deserve to be heard. Bring your ideas to life, from epic adventures to heartwarming tales. Share your creativity with the world!"
            }
          />
        </div>
        <div className="main_thread_suggestion_previews_two">
          <ThreadBox
            title={"Discover New Stories"}
            content={
              "Dive into a library of captivating tales written by storytellers like you. Get inspired, connect with authors, and experience the magic of storytelling."
            }
          />
        </div>
        <div className="main_thread_suggestion_previews_three">
          <ThreadBox
            title={"Be Part of Something Bigger"}
            content={
              "Become a part of a community where every story matters. Publish your work, receive feedback, and grow as a writer. Together, we celebrate the art of storytelling."
            }
          />
        </div>
      </div>
    </div>
  );
};

export default MainThreadSuggestion;
