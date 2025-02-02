import React from "react";
import "./FilterSearch.css";

const FilterSearch = ({ keyword, setKeyword, handleSubmitFilter }) => {
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
          placeholder="Search for keyword"
          className="filter_search_input"
        />
        <button type="submit" className="filter_search_button">
          +
        </button>
      </form>
    </div>
  );
};

export default FilterSearch;
