import { useState, useEffect } from "react";
import "./styles/FilterSort.css";

const FilterSort = ({ sortingOptions, selectedOption, onSortChange }) => {
  const [isOptionsVisible, setOptionsVisible] = useState(false);

  useEffect(() => {
    const selectedOptionElement = document.querySelector(".selected-option");
    const sortOptionsElement = document.querySelector(".sort-options");

    const { offsetLeft, offsetTop, clientHeight, clientWidth } =
      selectedOptionElement;
    sortOptionsElement.style.top = `${offsetTop + clientHeight + 10}px`;
    sortOptionsElement.style.left = `${offsetLeft}px`;
    sortOptionsElement.style.width = `${clientWidth}px`;
  }, [isOptionsVisible]);

  const toggleOptions = () => {
    setOptionsVisible(!isOptionsVisible);
  };

  const handleOptionClick = (option) => {
    onSortChange(option);
    toggleOptions();
  };

  return (
    <div className="sort-filter">
      <div className="sort-header">
        <h2 className="sort-h2">Sort:</h2>
        <div className="selected-option" onClick={toggleOptions}>
          <strong>{selectedOption}</strong>
        </div>
        <div className={`sort-options ${isOptionsVisible ? "visible" : ""}`}>
          {sortingOptions.map((option, index) => (
            <div
              key={index}
              className={`sort-option ${
                selectedOption === option ? "selected" : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSort;
