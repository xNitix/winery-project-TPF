import CartProvider from "./CartContext";
import FavProvider from "./FavContext";

export default function AppProvider({ children }) {
  return (
    <CartProvider>
      <FavProvider>{children}</FavProvider>
    </CartProvider>
  );
}
