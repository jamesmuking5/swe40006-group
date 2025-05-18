import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Try to load cart from localStorage on initial render
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  // Save to localStorage when cart changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);
  
  const addToCart = (car) => {
    // Check if car is already in cart to avoid duplicates
    if (!cartItems.find(item => item._id === car._id)) {
      setCartItems(prevItems => [...prevItems, car]);
    }
  };
  
  const removeFromCart = (carId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== carId));
  };
  
  const clearCart = () => {
    setCartItems([]);
  };
  
  const cartTotal = cartItems.reduce((total, car) => total + car.price, 0);
  
  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart,
      cartTotal,
      cartCount: cartItems.length
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}