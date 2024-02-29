import React from "react";
import "./FilterSearch.css";

const FilterSearch = () => {
  return (
    <div className="filter_search">
      <div className="filter_search_filters">
        <p>Filter</p>
      </div>
      <form className="filter_search_form">
        <input type="text" placeholder="Search for book" className="filter_search_input" />
        <button type="submit" className="filter_search_button">
          +
        </button>
      </form>
    </div>
  );
};

export default FilterSearch;
