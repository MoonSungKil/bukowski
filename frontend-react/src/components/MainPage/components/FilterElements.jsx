import React from "react";
import "./FilterElements.css";

const FilterElements = ({ selectedGenres, setSelectedGenres, handleSubmitFilter }) => {
  const handleFilterTale = (e, genre) => {
    let genreRemoved = false;

    for (const alreadySelectedGenre of selectedGenres) {
      if (alreadySelectedGenre === genre) {
        const genresWithoutTheOneSelected = selectedGenres.filter((g) => g !== genre);
        setSelectedGenres([...genresWithoutTheOneSelected]);
        genreRemoved = true;
      }
    }

    if (!genreRemoved) {
      setSelectedGenres((prevState) => {
        const updatedGenres = [...prevState, genre];
        if (updatedGenres.length > 3) {
          return updatedGenres.slice(1);
        }
        return updatedGenres;
      });
    }

    handleSubmitFilter(e);
  };

  const allGenreElements = [
    "📖 Fiction",
    "📚 Non-Fiction",
    "🧸 Children",
    "🖋️ Poetry",
    "🎭 Drama",
    "🙏 Religious/Spiritual",
    "👁️ Surrealism",
    "🔍 Mystery",
    "🤔 Philosophy",
    "🏙️ Realism",
    "🧠 Psychology",
    "💭 Existentialism",
    "💼 Politics",
    "🔪 Thriller",
    "🏞️ Adventure",
    "👻 Horror",
    "💕 Romance",
    "🐉 Fantasy",
    "👽 Science-Fiction",
    "👤 Biography/Memoir",
    "🌍 Culture",
    "📈 Business",
    "🏺 History",
    "🤠 Western",
    "🌆 Dystopian",
    "💡 Self-Help",
    "🌌 Science",
  ];

  return (
    <ul className="filter_elements">
      {allGenreElements.map((genre) => {
        const startingIndex = genre.indexOf(" ");
        const justGenreName = genre.slice(startingIndex + 1);
        return (
          <li
            onClick={(e) => handleFilterTale(e, justGenreName)}
            className={`filter_elements_list ${
              selectedGenres.some((genre) => genre === justGenreName) && "filter_element_selected"
            }`}
          >
            {genre}
          </li>
        );
      })}
    </ul>
  );
};

export default FilterElements;
