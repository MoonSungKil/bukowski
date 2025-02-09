import React from "react";
import "./FilterSearch.css";

const FilterSearch = ({ keyword, setKeyword, handleSubmitFilter, displayType, setDisplayType }) => {
  return (
    <div className="filter_search">
      <div className="filter_search_filters">
        <p>Filter</p>
      </div>
      <form onSubmit={(e) => handleSubmitFilter(e)} className="filter_search_form">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          type="text"
          placeholder="All"
          className="filter_search_input"
        />
      </form>
      <div
        onClick={() => setDisplayType("box")}
        className={`filter_search_type_box ${
          displayType === "box" && "filter_search_type_selected"
        }`}
      >
        <i className="fa-solid fa-box"></i>
      </div>
      <div
        onClick={() => setDisplayType("list")}
        className={`filter_search_type_list ${
          displayType === "list" && "filter_search_type_selected"
        }`}
      >
        <i className="fa-solid fa-list"></i>
      </div>
    </div>
  );
};

export default FilterSearch;
