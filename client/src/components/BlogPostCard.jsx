import React from "react";
import "./styles/BlogPostCard.css";

const BlogPostCard = ({ imageSrc, title, link }) => {
  return (
    <div className="blog-post-card">
      <a href={link} target="_blank">
        <img src={imageSrc} alt={title} className="blog-post-image" />
        <div className="blog-post-title">{title}</div>
      </a>
    </div>
  );
};

export default BlogPostCard;
