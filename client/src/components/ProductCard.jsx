import { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/ProductCard.css";
import ItemBuyMenu from "./ItemBuyMenu";
import FavIcon from "./FavIcon";
import RenderStars from "./StarRender";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const ProductCard = ({ product }) => {
  const [isBuyMenuVisible, setIsBuyMenuVisible] = useState(false);
  const { user } = useContext(AuthContext);

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img src={product.imageUrl} alt={product.name} />
        <h3>{product.name}</h3>
        <p>
          {product.country}/{product.type}
        </p>
        <p>{product.price} ZŁ</p>
      </Link>
      {product.amount > 0 ? (
        <>
          <button
            onClick={() => {
              setIsBuyMenuVisible(true);
            }}
            className="buy-button"
          >
            Buy
          </button>
        </>
      ) : (
        <p>
          <br></br>
          <strong>Out of stock</strong>
        </p>
      )}
      <RenderStars rating={product.rating} />
      {isBuyMenuVisible && (
        <ItemBuyMenu
          product={product}
          isOpen={isBuyMenuVisible}
          onClose={() => setIsBuyMenuVisible(false)}
        />
      )}
      <div
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          fontSize: "25px",
        }}
      >
        {user && <FavIcon id={product.id} />}
      </div>
    </div>
  );
};

export default ProductCard;
