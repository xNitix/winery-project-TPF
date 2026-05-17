import React from "react";
import BlogPostCard from "./BlogPostCard";
import "./styles/BlogList.css"; // Styles for the blog layout

const blogPosts = [
  {
    title: "Aging, Red Wine Gets Lighter",
    imageSrc: "/src/assets/blogPost/blog1.png",
  },
  {
    title: "Knives & Glasses Not for Beauty",
    imageSrc: "/src/assets/blogPost/blog2.png",
  },
  {
    title: "How Toasts Came To Be",
    imageSrc: "/src/assets/blogPost/blog3.png",
  },
];

const BlogList = () => {
  return (
    <div className="blog-container">
      {blogPosts.map((post, index) => (
        <BlogPostCard
          key={index}
          imageSrc={post.imageSrc}
          title={post.title}
          link={"https://youtu.be/dQw4w9WgXcQ?si=24CPUBEdoUzJ6Hl"}
        />
      ))}
    </div>
  );
};

export default BlogList;
