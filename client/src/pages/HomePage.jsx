import React, { useState, useEffect, useContext } from "react";
import Slider from "../components/Slider";
import CategoryMenu from "../components/CategoryMenu";
import ProductCard from "../components/ProductCard";
import "./HomePage.css";
import BlogList from "../components/BlogList";
import { ProductContext } from "../context/ProductContext";

const HomePage = () => {
  // const { authTokens, logoutUser } = useContext(AuthContext);

  // Jak fetchować z tokenem:
  // let [profile, setProfile] = useState([])

  // useEffect(() => {
  //     getProfile()
  // },[])

  // const getProfile = async() => {
  //     let response = await fetch('http://127.0.0.1:8000/api/profile', {
  //     method: 'GET',
  //     headers:{
  //         'Content-Type': 'application/json',
  //         'Authorization':'Bearer ' + String(authTokens.access)
  //     }
  //     })
  //     let data = await response.json()
  //     console.log(data)
  //     if(response.status === 200){
  //         setProfile(data)
  //     } else if(response.statusText === 'Unauthorized'){
  //         logoutUser()
  //     }
  // }

  const [currentPage, setCurrentPage] = useState(0);

  const { products } = useContext(ProductContext);

  return (
    <div className="app-layout">
      <div style={{ display: "flex", margin: "30px" }}>
        <CategoryMenu />
        <Slider />
      </div>
      <div className="bestsellers">
        <h1>Bestsellers</h1>
        <div className="product-list">
          {products.slice(0, 4).map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
      <div className="new-arrivals"></div>
      <h1>New arrivals</h1>
      <div className="product-list">
        {products.slice(7, 11).map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
      <div className="blog">
        <h1>Our Blog</h1>
        <BlogList />
      </div>

      <div className="about-us">
        <h1>About us</h1>
        <p>
          Welcome to Vinum Elegance, your gateway to the world's finest wines.
          Nestled in the heart of wine country, we are a family-owned boutique
          with a rich heritage of viticulture and a passion for excellence. Our
          journey began over three decades ago, rooted in the simple yet
          profound love for the artistry that goes into every bottle.
          <br /> <br />
          At Vinum Elegance, we believe that wine is more than just a
          beverage—it's a story in a glass, waiting to unfold with each sip. Our
          meticulously curated selection showcases the best of both Old World
          and New World wines, from the rolling hills of Tuscany to the
          sun-kissed valleys of Napa. Each bottle in our collection is
          handpicked for its quality, provenance, and the exquisite experience
          it offers.
          <br /> <br /> Our founders, the Belmonte family, have traveled the
          globe, forging relationships with renowned vintners and undiscovered
          gems alike. These connections allow us to bring an exceptional variety
          of wines to our discerning clientele. Whether you're a seasoned
          collector or a casual enthusiast, we're dedicated to guiding you
          through the nuanced world of wine.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
