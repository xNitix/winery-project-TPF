import { createContext, useReducer } from "react";

export const CartContext = createContext(null);
export const CartDispatchContext = createContext(null);

export default function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  return (
    <CartContext.Provider value={cart}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartContext.Provider>
  );
}
function cartReducer(cart, action) {
  switch (action.type) {
    case "added": {
      const existingCartItem = cart.find((item) => item.id === action.item.id);
      if (existingCartItem) {
        return cart.map((item) =>
          item.id === action.item.id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + action.item.quantity,
                  item.maxQuantity
                ),
              }
            : item
        );
      } else {
        return [...cart, { ...action.item, quantity: action.item.quantity }];
      }
    }
    case "updated": {
      return cart.map((item) =>
        item.id === action.id ? { ...item, quantity: action.quantity } : item
      );
    }
    case "deleted": {
      return cart.filter((item) => item.id !== action.id);
    }
    case "cleared": {
      return [];
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
