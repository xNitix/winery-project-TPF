import React from "react";
import { Link } from "react-router-dom";
import "./styles/CategoryMenu.css";

const CategoryMenu = () => {
  const categories = [
    "Wines of Ukraine",
    "Wines of Europe",
    "Wines of the East",
    "Wines of America",
    "Wines of Oceania",
    "Champagne and Sparkling",
    "Accessories",
  ];

  return (
    <ul className="category-menu">
      {categories.map((category, index) => (
        <li key={index}>
          <a
            href="https://youtu.be/dQw4w9WgXcQ?si=24CPUBEdoUzJ6Hlx"
            target="_blank"
          >
            {category}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default CategoryMenu;
