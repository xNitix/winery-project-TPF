import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import AuthContext from "../../context/AuthContext";
import "./CartModal.css";

const CartSummary = ({ onClose }) => {
  const cartItems = useContext(CartContext);
  const user = useContext(AuthContext);
  const navigate = useNavigate();

  const calculateTotalPrice = (cartItems) => {
    const totalPrice = cartItems.reduce((total, item) => {
      const itemPrice = parseFloat(item.price) || 0;
      const itemQuantity = parseInt(item.quantity) || 0;
      return total + itemPrice * itemQuantity;
    }, 0);

    return totalPrice.toFixed(2);
  };

  const handlePayment = () => {
    onClose();
    navigate("/payment");
  };

  const handleNotLoggedUser = () => {
    alert("User must be logged in");
  };

  console.log(user);
  return (
    <div className="cart-summary">
      <p>Total Price: {calculateTotalPrice(cartItems)}</p>
      <button
        className="go-to-payment-button"
        onClick={user.user !== null ? handlePayment : handleNotLoggedUser}
      >
        Go to Payment
      </button>
    </div>
  );
};

export default CartSummary;
