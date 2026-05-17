import React, { useState } from "react";
import "./styles/ProductDetails.css";
import ReviewWriter from "./productReviews/ReviewWriter";
import ReviewList from "./productReviews/ReviewList.jsx";

const ProductDetails = ({ product }) => {
  const [activeSection, setActiveSection] = useState("description");

  return (
    <div className="product-details">
      <div className="tabs">
        <button
          className={activeSection === "description" ? "tab active" : "tab"}
          onClick={() => setActiveSection("description")}
        >
          Description
        </button>
        <button
          className={activeSection === "delivery" ? "tab active" : "tab"}
          onClick={() => setActiveSection("delivery")}
        >
          Delivery
        </button>
        <button
          className={activeSection === "reviews" ? "tab active" : "tab"}
          onClick={() => setActiveSection("reviews")}
        >
          Reviews
        </button>
        <button
          className={activeSection === "writeReview" ? "tab active" : "tab"}
          onClick={() => setActiveSection("writeReview")}
        >
          Write a review
        </button>
      </div>
      {activeSection === "description" && (
        <div className="description">
          <p>
            <strong>Description:</strong> {product.description}
          </p>
          <p>
            <strong>Type:</strong> {product.type}
          </p>
          <p>
            <strong>Country:</strong> {product.country}
          </p>
          <p>
            <strong>Vintage:</strong> {product.year}
          </p>
          <p>
            <strong>Alcohol:</strong> {product.alcohol}%
          </p>
        </div>
      )}
      {activeSection === "reviews" && (
        <div>
          <ReviewList product={product} />
        </div>
      )}
      {activeSection === "writeReview" && (
        <div>
          <ReviewWriter product={product} />
        </div>
      )}
      {activeSection === "delivery" && (
        <div className="delivery">
          <h3>Delivery Information</h3>
          <p>
            1. Delivery to the "Nova Poshta" office, free from 420 ZŁ. (for
            orders up to 420 ZŁ, the cost of delivery and packaging is 25 Zł).
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
