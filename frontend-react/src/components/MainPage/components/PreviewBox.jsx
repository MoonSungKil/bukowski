import React from "react";
import "./PreviewBox.css";

const PreviewBox = ({ tale, position, hover }) => {
  if (hover) {
    return (
      <div
        style={{
          top: `${position.y}px`,
          left: `${position.x}px`,
        }}
        className="preview_box_container"
      >
        <div className="preview_box">
          <p className="preview_box_paragraph">{tale.preview}</p>
          <div className="preview_box_genre_list">
            {tale.genres.map((genre) => (
              <p
                className={`preview_box_genre genre_type_name_${genre.name
                  .toLowerCase()
                  .replace(/[\/\-]/g, "_")}`}
              >
                {genre.name}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

export default PreviewBox;
