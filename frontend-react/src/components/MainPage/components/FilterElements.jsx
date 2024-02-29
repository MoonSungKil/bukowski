import React from "react";
import "./FilterElements.css";

const FilterElements = () => {
  return (
    <ul className="filter_elements">
      <li className="filter_elements_list">📖 Fiction</li>
      <li className="filter_elements_list">📚 Non-fiction</li>
      <li className="filter_elements_list">🧸 Children's</li>
      <li className="filter_elements_list">📜 Poetry</li>
      <li className="filter_elements_list">🎭 Drama/Play</li>
      <li className="filter_elements_list">🙏 Religious/Spiritual</li>
      <li className="filter_elements_list">🎨 Art</li>
      <li className="filter_elements_list">🤔 Philosophy</li>
      <li className="filter_elements_list">🧠 Psychology</li>
      <li className="filter_elements_list">💭 Existencialism </li>
      <li className="filter_elements_list">📓 Reference</li>
      <li className="filter_elements_list">💕 Romance</li>
      <li className="filter_elements_list">🐉 Fantasy</li>
      <li className="filter_elements_list">👽 Sci-Fi</li>
      <li className="filter_elements_list">👤 Biography/Autobiography</li>
      <li className="filter_elements_list">🌍 Culture</li>
    </ul>
  );
};

export default FilterElements;
