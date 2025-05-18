import { useState, useEffect } from "react";
import "./CarList.css";

// Construct the base URL for the API
// Fallback to a sensible default if the env var isn't set
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function CarList() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        // Use the API_BASE_URL
        const response = await fetch(`${API_BASE_URL}/carinfo/getData`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        //DEBUG
        console.log("Fetched car data:", data);

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

  if (loading) {
    return <p>Loading car data...</p>;
  }

  if (error) {
    return <p>Error fetching data: {error}</p>;
  }

  return (
    <div className="car-list-container">
      <h2>Available Cars</h2>
      {cars.length === 0 ? (
        <p>No cars available.</p>
      ) : (
        <ul className="car-list">
          {cars.map((car, index) => (
            <li key={car._id || index} className="car-item">
              <img className="car-image"
                src={`${API_BASE_URL}/images/${car.imageName}`}
                alt={`${car.make} ${car.model}`}
              />
              <h3>
                {car.make} {car.model}
              </h3>
              <p>Year: {car.year}</p>
              <p>Price: ${car.price.toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CarList;