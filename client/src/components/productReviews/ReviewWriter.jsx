import React, { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import "./ReviewWriter.css";
import InteractiveStars from "./InteractiveStars";
import { ProductContext } from "../../context/ProductContext";

const ReviewWriter = ({ product }) => {
  const [review, setReview] = useState("");
  const { user, authTokens } = useContext(AuthContext);
  const { updateProduct } = useContext(ProductContext);
  const [rating, setRating] = useState(0);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const submitReview = async () => {
    let formData = {
      content: review,
      rating: rating,
    };
    setReview("");
    handleReview(formData);
  };

  const handleReview = async (formData) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/wines/${product.id}/reviews/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        updateProduct(product.id);
      } else {
        console.error("Failed to write review:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while processing review:", error);
    }
  };

  return (
    <>
      {user ? (
        <div className="review-form">
          <textarea
            value={review}
            onChange={handleReviewChange}
            placeholder="Write your review here..."
            rows="4"
          ></textarea>
          <div>
            <InteractiveStars
              initialRating={0}
              onRatingChange={handleRatingChange}
            />
            <button onClick={submitReview}>Submit Review</button>
          </div>
        </div>
      ) : (
        <h3>Log in to write a review</h3>
      )}
    </>
  );
};

export default ReviewWriter;
