import React, { useEffect, useState } from "react";
import "./MainPageBody.css";
import FilterSearch from "./FilterSearch";
import TalePreview from "./TalePreview";
import FilterElements from "./FilterElements";
import { useSiteState } from "../../../context/SiteStateContext";
import ListTalePreview from "./ListTalePreview";

const MainPageBody = () => {
  const { getAllTales, filteredTales, filterTales } = useSiteState();

  const [keyword, setKeyword] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);

  const [displayType, setDisplayType] = useState("list");

  const handleSubmitFilter = (e) => {
    e.preventDefault();
    filterTales(keyword, selectedGenres);
  };

  useEffect(() => {
    getAllTales();
  }, []);

  useEffect(() => {
    filterTales(keyword, selectedGenres);
  }, [keyword, selectedGenres]);

  return (
    <div className="main_page_body_container">
      <div className="main_page_body">
        <FilterSearch
          keyword={keyword}
          setKeyword={setKeyword}
          handleSubmitFilter={handleSubmitFilter}
          displayType={displayType}
          setDisplayType={setDisplayType}
        />
        <FilterElements
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          handleSubmitFilter={handleSubmitFilter}
        />
        {displayType === "box" ? (
          <div className="main_page_body_collection">
            {filteredTales.length > 0 ? (
              filteredTales.map((tale) => <TalePreview key={tale.id} tale={tale} />)
            ) : (
              <div className="main_page_body_empty">No Tales Found</div>
            )}
          </div>
        ) : (
          <div className="main_page_body_collection_list">
            {filteredTales.length > 0 ? (
              filteredTales.map((tale) => <ListTalePreview key={tale.id} tale={tale} />)
            ) : (
              <div className="main_page_body_empty">No Tales Found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPageBody;
