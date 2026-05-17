import { useContext } from "react";
import Modal from "react-modal";
import "./CartModal.css";
import CartList from "./CartList";
import CartSummary from "./CartSummary";
import { CartContext } from "../../context/CartContext";

const CartModal = ({ isOpen, onClose }) => {
  const cart = useContext(CartContext);
  const isCartEmpty = cart.length === 0;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Cart Items"
      className="custom-cart-modal"
      overlayClassName="cart-overlay"
      appElement={document.getElementById("root")}
    >
      {isCartEmpty ? (
        <div className="empty-cart-container">
          <img src="/src/assets/empty-cart.png" alt="Empty cart" />
        </div>
      ) : (
        <>
          <CartList />
          <CartSummary onClose={onClose} />
        </>
      )}
    </Modal>
  );
};

export default CartModal;
