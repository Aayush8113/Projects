import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("la_mansa_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("la_mansa_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = (product) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? {...i, quantity: i.quantity + 1} : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (id) => setCartItems(prev => prev.filter(i => i.id !== id));
  const increment = (id) => setCartItems(prev => prev.map(i => i.id === id ? {...i, quantity: i.quantity + 1} : i));
  const decrement = (id) => setCartItems(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity - 1)} : i));
  const clearCart = () => setCartItems([]);
  const getTotal = () => cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, addItem, removeItem, increment, decrement, clearCart, getTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);