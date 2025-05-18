import { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import "./CarList.css";

// Construct the base URL for the API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function CarList() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/carinfo/getData`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCars(data);
      } catch (e) {
        setError(e.message);
        console.error("Failed to fetch car data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, []);

  // Check if car is already in cart
  const isInCart = (carId) => {
    return cartItems.some(item => item._id === carId);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading car data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error fetching data: {error}</p>
      </div>
    );
  }

  return (
    <div className="car-list-container">
      <h2>Available Cars</h2>
      {cars.length === 0 ? (
        <div className="empty-state">
          <p>No cars available.</p>
        </div>
      ) : (
        <ul className="car-list">
          {cars.map((car, index) => (
            <li key={car._id || index} className="car-item">
              <div className="car-image-container">
                <img className="car-image"
                  src={`${API_BASE_URL}/images/${car.imageName}`}
                  alt={`${car.make} ${car.model}`}
                />
                {car.price > 25000 && (
                  <span className="premium-badge">Premium</span>
                )}
              </div>
              <div className="car-details">
                <h3>{car.make} {car.model}</h3>
                <div className="car-specs">
                  <span className="car-year">{car.year}</span>
                  <span className="car-price">${car.price.toLocaleString()}</span>
                </div>
                <button 
                  className={`add-to-cart-button ${isInCart(car._id) ? 'in-cart' : ''}`}
                  onClick={() => addToCart(car)}
                  disabled={isInCart(car._id)}
                >
                  {isInCart(car._id) ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CarList;