import React, { useState } from "react";

const InteractiveStars = ({ initialRating, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating || 0);
  const [hoverRating, setHoverRating] = useState(0);

  const determineRating = (value, isHalfStar) => {
    return isHalfStar ? value - 0.5 : value;
  };

  const handleClick = (value, isHalfStar) => {
    const newRating = determineRating(value, isHalfStar);
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleMouseMove = (e, value) => {
    const rect = e.target.getBoundingClientRect();
    const isHalfStar = e.clientX - rect.left < rect.width / 2;
    setHoverRating(determineRating(value, isHalfStar));
  };

  const renderStar = (value) => {
    const fullStar = rating >= value || hoverRating >= value;
    const halfStar = rating >= value - 0.5 || hoverRating >= value - 0.5;
    return (
      <span
        key={value}
        className={`star ${fullStar ? "full" : halfStar ? "half" : "empty"}`}
        onClick={(e) =>
          handleClick(
            value,
            e.clientX <
              e.target.getBoundingClientRect().left + e.target.offsetWidth / 2
          )
        }
        onMouseMove={(e) => handleMouseMove(e, value)}
      >
        ★
      </span>
    );
  };

  return (
    <div className="rating" onMouseLeave={() => setHoverRating(0)}>
      {[1, 2, 3, 4, 5].map(renderStar)}
    </div>
  );
};

export default InteractiveStars;
