import { useState } from 'react';
import { useCart } from './CartContext';
import './Cart.css';

function Cart() {
  const { cartItems, removeFromCart, clearCart, cartTotal } = useCart();
  const [showModal, setShowModal] = useState(false);
  
  const handlePurchase = () => {
    if (cartItems.length > 0) {
      setShowModal(true);
    }
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    clearCart();
  };
  
  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          <ul className="cart-items">
            {cartItems.map((car) => (
              <li key={car._id} className="cart-item">
                <img 
                  src={`${import.meta.env.VITE_API_BASE_URL}/images/${car.imageName}`} 
                  alt={`${car.make} ${car.model}`} 
                  className="cart-item-image" 
                />
                <div className="cart-item-details">
                  <h3>{car.make} {car.model}</h3>
                  <p>${car.price.toLocaleString()}</p>
                </div>
                <button 
                  className="remove-button" 
                  onClick={() => removeFromCart(car._id)}
                  aria-label="Remove from cart"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          
          <div className="cart-summary">
            <div className="cart-total">
              <span>Total:</span>
              <span className="total-price">${cartTotal.toLocaleString()}</span>
            </div>
            <button className="purchase-button" onClick={handlePurchase}>
              Complete Purchase
            </button>
          </div>
        </>
      )}
      
      {/* Purchase Success Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="success-icon">✓</div>
            <h3>Purchase Complete!</h3>
            <p>Thank you for your order.</p>
            <button className="modal-close" onClick={handleCloseModal}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;