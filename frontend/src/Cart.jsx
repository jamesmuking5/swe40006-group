import { useState } from 'react';
import { useCart } from './CartContext';
import './Cart.css';

function Cart() {
  const { cartItems, removeFromCart, clearCart, cartTotal } = useCart();
  const [showModal, setShowModal] = useState(false);
  // Add state for image popup
  const [selectedImage, setSelectedImage] = useState(null);
  
  const handlePurchase = () => {
    if (cartItems.length > 0) {
      setShowModal(true);
    }
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    clearCart();
  };
  
  // Function to show image popup
  const handleImageClick = (car) => {
    setSelectedImage(car);
  };
  
  // Function to close image popup
  const closeImagePopup = () => {
    setSelectedImage(null);
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
                  onClick={() => handleImageClick(car)}
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
            <p>Thank you for your order. Your cars will be delivered tomorrow.</p>
            
            <button className="modal-close" onClick={handleCloseModal}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
      
      {/* Image Popup Modal */}
      {selectedImage && (
        <div className="image-modal-overlay" onClick={closeImagePopup}>
          <div className="image-modal" onClick={e => e.stopPropagation()}>
            <button className="image-modal-close" onClick={closeImagePopup}>×</button>
            <h3>{selectedImage.make} {selectedImage.model}</h3>
            <div className="full-image-container">
              <img 
                src={`${import.meta.env.VITE_API_BASE_URL}/images/${selectedImage.imageName}`} 
                alt={`${selectedImage.make} ${selectedImage.model}`} 
                className="full-image"
              />
            </div>
            <div className="image-modal-details">
              <p>Year: {selectedImage.year}</p>
              <p>Price: ${selectedImage.price.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;