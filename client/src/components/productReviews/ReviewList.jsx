import { useState, useEffect } from "react";
import "./ReviewList.css";
import StarRender from "../StarRender";

const ReviewList = ({ product }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getReviews();
  }, []);

  const getReviews = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/wines/${product.id}/reviews/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let data = await response.json();
      data.map((review) => {
        (review.username = review.user.username),
          (review.userid = review.user.id),
          delete review.user;
      });

      if (response.ok) {
        setReviews(data);
      } else {
        console.error("Failed to fetch review:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while fetching reviews:", error);
    }
  };

  return (
    <div className="reviews">
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className="review-item">
            <h4>{review.username}</h4>
            <p className="review-content">{review.content}</p>
            <StarRender rating={review.rating} />
            <p className="review-date">
              Posted on {new Date(review.created).toLocaleDateString()}
            </p>
          </div>
        ))
      ) : (
        <p>No reviews available for this product.</p>
      )}
    </div>
  );
};

export default ReviewList;
