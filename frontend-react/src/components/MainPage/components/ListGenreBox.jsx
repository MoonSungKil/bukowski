import React from "react";
import "./ListGenreBox.css";

const ListGenreBox = ({ tale, position, hover }) => {
  if (hover) {
    return (
      <div
        style={{
          top: `${position.y}px`,
          left: `${position.x}px`,
        }}
        className="list_genre_box"
      >
        <div className="list_genre_box_list">
          {tale.genres.map((genre) => (
            <p
              className={`list_genre_box_genre genre_type_name_${genre.name
                .toLowerCase()
                .replace(/[\/\-]/g, "_")}`}
            >
              {genre.name}
            </p>
          ))}
        </div>
      </div>
    );
  }
};

export default ListGenreBox;
