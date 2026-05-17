import React, { useState, useEffect, useRef } from "react";
import "./styles/Slider.css";

const images = [
  "/src/assets/slider/slider1.png",
  "/src/assets/slider/slider2.png",
  "/src/assets/slider/slider3.png",
];

const Slider = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef(null);

  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
  };

  useEffect(() => {
    resetInterval();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const goToImage = (index) => {
    setCurrentImageIndex(index);
    resetInterval();
  };

  return (
    <div className="image-slider">
      <img
        src={images[currentImageIndex]}
        alt={`Wine Bottle ${currentImageIndex + 1}`}
      />
      <div className="dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentImageIndex === index ? "active" : ""}`}
            onClick={() => goToImage(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slider;
