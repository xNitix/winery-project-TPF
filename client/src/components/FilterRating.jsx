import { useState } from "react";
import RenderStars from "./StarRender";
import "./styles/FilterRating.css";

const FilterRating = ({ onRatingChange }) => {
  const [selectedRating, setSelectedRating] = useState(0);

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    if (onRatingChange) {
      onRatingChange(rating);
    }
  };

  return (
    <div className="rating-filter-container">
      <h2 className="rating-header">Average Rating</h2>
      <div className="single-rating-container">
        <input
          type="radio"
          id="rating-4.5"
          name="rating"
          checked={selectedRating === 4.5}
          onChange={() => handleRatingChange(4.5)}
        />
        <label className="rating-label" htmlFor="rating-4.5">
          <RenderStars rating={4.5} />
          <div className="rating-description">
            <strong>4.5+ </strong>Very rare stuff
          </div>
        </label>
      </div>

      <div className="single-rating-container">
        <input
          type="radio"
          id="rating-4.0"
          name="rating"
          checked={selectedRating === 4.0}
          onChange={() => handleRatingChange(4.0)}
        />
        <label className="rating-label" htmlFor="rating-4.0">
          <RenderStars rating={4.0} />
          <div className="rating-description">
            <strong>4.0+ </strong>Good stuff
          </div>
        </label>
      </div>

      <div className="single-rating-container">
        <input
          type="radio"
          id="rating-3.5"
          name="rating"
          checked={selectedRating === 3.5}
          onChange={() => handleRatingChange(3.5)}
        />
        <label className="rating-label" htmlFor="rating-3.5">
          <RenderStars rating={3.5} />
          <div className="rating-description">
            <strong>3.5+ </strong>Common stuff
          </div>
        </label>
      </div>

      <div className="single-rating-container">
        <input
          type="radio"
          id="rating-any"
          name="rating"
          checked={selectedRating === 0}
          onChange={() => handleRatingChange(0)}
        />
        <label className="rating-label" htmlFor="rating-any">
          <div className="rating-description">Any rating</div>
        </label>
      </div>
    </div>
  );
};

export default FilterRating;
