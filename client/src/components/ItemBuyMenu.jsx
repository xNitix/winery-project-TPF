import React, { useContext, useState } from "react";
import Modal from "react-modal";
import "./styles/ItemBuyMenu.css";

import QuantityPicker from "./QuantityPicker";
import { CartDispatchContext } from "../context/CartContext";

const ItemBuyMenu = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);

  const dispatch = useContext(CartDispatchContext);

  const handleBuyClick = () => {
    const cartItem = {
      id: product.id,
      image: product.imageUrl,
      name: product.name,
      quantity: quantity,
      maxQuantity: product.amount,
      price: product.price,
    };
    dispatch({
      type: "added",
      item: cartItem,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Item Buy Menu"
      className="item-custom-modal"
      overlayClassName="item-buy-overlay"
      appElement={document.getElementById("root")}
    >
      <div className="item-buy-menu">
        <div className="item-buy-image">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        <div className="item-buy-details">
          <div className="item-buy-header">
            <h2>{product.name}</h2>
          </div>
          <p>
            {product.country}/{product.type}
          </p>
          <p>{product.price} zł</p>
          <p>On stock: {product.amount}</p>
          <QuantityPicker
            quantity={quantity}
            maxQuantity={product.amount}
            onUpdateQuantity={setQuantity}
          />
          <button id="add-to-cart-button" onClick={handleBuyClick}>
            Add to cart
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ItemBuyMenu;
