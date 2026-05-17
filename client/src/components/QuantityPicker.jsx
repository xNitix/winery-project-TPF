import React from "react";
import "./styles/QuantityPicker.css";

const QuantityPicker = ({
  quantity = 1,
  maxQuantity = Infinity,
  onUpdateQuantity,
}) => {
  const handleQuantityChange = (event) => {
    onUpdateQuantity(
      parseInt(event.target.value) > 1
        ? Math.min(parseInt(event.target.value), maxQuantity)
        : 1
    );
  };

  const handleIncrementButton = () => {
    onUpdateQuantity(Math.min(quantity + 1, maxQuantity));
  };

  const handleDecrementButton = () => {
    onUpdateQuantity(quantity - 1 >= 1 ? quantity - 1 : 1);
  };

  return (
    <>
      <div className="quantity-selector">
        <button onClick={handleDecrementButton}>-</button>
        <input type="text" value={quantity} onChange={handleQuantityChange} />
        <button onClick={handleIncrementButton}>+</button>
      </div>
    </>
  );
};

export default QuantityPicker;
