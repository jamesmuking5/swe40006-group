import { useState } from 'react';
import { ChevronRight, Star, Clock, Calendar, DollarSign, Activity, MapPin, Fuel, ShoppingCart } from 'lucide-react';

// Sample car data
const carData = [
  {
    id: 1,
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    price: 42990,
    mileage: 0,
    fuelType: "Electric",
    location: "San Francisco, CA",
    rating: 4.9,
    image: "/tesla3.png",
    description: "Experience the future of driving with the Tesla Model 3. This all-electric sedan offers incredible range, impressive performance, and cutting-edge technology. With zero emissions and instant acceleration, it redefines what a car can be.",
    features: ["Autopilot", "15-inch touchscreen", "Glass roof", "Heated seats", "Premium sound system"]
  },
  {
    id: 2,
    make: "Toyota",
    model: "Camry",
    year: 2024,
    price: 27990,
    mileage: 12,
    fuelType: "Hybrid",
    location: "Los Angeles, CA",
    rating: 4.7,
    image: "/camry.png",
    description: "The Toyota Camry Hybrid combines efficiency with style. Known for its reliability and comfort, this sedan gives you the best of both worlds with impressive fuel economy and a smooth, comfortable ride.",
    features: ["Toyota Safety Sense", "Apple CarPlay", "Android Auto", "JBL Audio", "Sunroof"]
  },
  {
    id: 3,
    make: "Honda",
    model: "CR-V",
    year: 2024,
    price: 32590,
    mileage: 5,
    fuelType: "Gasoline",
    location: "Chicago, IL",
    rating: 4.5,
    image: "/crv.png",
    description: "The Honda CR-V continues to set the standard for compact SUVs. With its spacious interior, excellent fuel economy, and advanced safety features, it's the perfect vehicle for families and adventurers alike.",
    features: ["Honda Sensing", "Wireless charging", "Heated steering wheel", "Power tailgate", "Panoramic sunroof"]
  },
  {
    id: 4,
    make: "BMW",
    model: "X5",
    year: 2024,
    price: 63900,
    mileage: 8,
    fuelType: "Hybrid",
    location: "Miami, FL",
    rating: 4.6,
    image: "/bmw.png",
    description: "The BMW X5 xDrive45e plug-in hybrid combines luxury, performance, and efficiency. With its refined interior, powerful engine, and electric range, it represents the best of BMW's engineering excellence.",
    features: ["BMW iDrive 8", "Harman Kardon surround sound", "Head-up display", "Active driving assistant", "4-zone climate control"]
  },
  {
    id: 5,
    make: "Hyundai",
    model: "Ioniq 5",
    year: 2024,
    price: 39950,
    mileage: 0,
    fuelType: "Electric",
    location: "Seattle, WA",
    rating: 4.9,
    image: "/ioniq.png",
    description: "The Hyundai Ioniq 5 is redefining the electric vehicle experience with its retro-futuristic design and cutting-edge technology. With ultra-fast charging and vehicle-to-load capability, it's as practical as it is stylish.",
    features: ["800V ultra-fast charging", "Vehicle-to-Load function", "Sliding center console", "Relaxation seats", "Augmented reality HUD"]
  }
];

// Format price with commas
const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Car List Item Component
const CarListItem = ({ car, isSelected, onClick }) => {
  return (
    <div 
      onClick={() => onClick(car)} 
      className={`p-4 border-b border-gray-200 flex items-center cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
    >
      <div className="flex-shrink-0 mr-4">
        <img 
          src={car.image} 
          alt={`${car.make} ${car.model}`} 
          className="w-24 h-16 object-cover rounded"
        />
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold text-lg">{car.year} {car.make} {car.model}</h3>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <DollarSign size={14} className="mr-1" />
          <span className="mr-3">${formatPrice(car.price)}</span>
          <Clock size={14} className="mr-1" />
          <span>{car.mileage} mi</span>
        </div>
      </div>
      <div className="flex-shrink-0 text-gray-400">
        <ChevronRight size={20} />
      </div>
    </div>
  );
};

// Car Details Component
const CarDetails = ({ car, onCheckout }) => {
  if (!car) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-center">
        <div className="max-w-md">
          <h3 className="text-xl font-semibold text-gray-500 mb-2">Select a Car</h3>
          <p className="text-gray-400">Choose a car from the list to view detailed information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <img 
          src={car.image} 
          alt={`${car.make} ${car.model}`} 
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{car.year} {car.make} {car.model}</h2>
        <div className="flex items-center text-yellow-500">
          <Star size={18} className="fill-current" />
          <span className="ml-1 text-gray-700">{car.rating}/5</span>
        </div>
      </div>
      
      <div className="text-3xl font-bold text-blue-600 mb-4">
        ${formatPrice(car.price)}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center">
          <Calendar size={18} className="text-gray-500 mr-2" />
          <span>{car.year}</span>
        </div>
        <div className="flex items-center">
          <Activity size={18} className="text-gray-500 mr-2" />
          <span>{car.mileage} miles</span>
        </div>
        <div className="flex items-center">
          <Fuel size={18} className="text-gray-500 mr-2" />
          <span>{car.fuelType}</span>
        </div>
        <div className="flex items-center">
          <MapPin size={18} className="text-gray-500 mr-2" />
          <span>{car.location}</span>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-gray-600">{car.description}</p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Features</h3>
        <ul className="grid grid-cols-2 gap-2">
          {car.features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-600">
              <ChevronRight size={16} className="text-blue-500 mr-1" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      
      <button 
        onClick={() => onCheckout(car)}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center"
      >
        <ShoppingCart size={18} className="mr-2" />
        Continue to Checkout
      </button>
    </div>
  );
};

// Main App Component
export default function CarListingPage() {
  const [selectedCar, setSelectedCar] = useState(null);
  
  const handleCarSelect = (car) => {
    setSelectedCar(car);
  };
  
  const handleCheckout = (car) => {
    // navigates to checkout page
    // but for demo purposes, just show an alert
    alert(`Proceeding to checkout for ${car.year} ${car.make} ${car.model}`);
  };
  
  return (
    <div className="flex flex-col h-screen w-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">Cars</h1>
          <div className="flex items-center space-x-4">
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-grow overflow-hidden">
        {/* Left Panel - Car List (70%) */}
        <div className="w-7/12 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Available Cars</h2>
            <p className="text-gray-500 text-sm">
              {carData.length} cars found
            </p>
          </div>
          <div>
            {carData.map(car => (
              <CarListItem 
                key={car.id} 
                car={car} 
                isSelected={selectedCar && selectedCar.id === car.id}
                onClick={handleCarSelect} 
              />
            ))}
          </div>
        </div>
        
        {/* Right Panel - Car Details (30%) */}
        <div className="w-5/12 bg-white overflow-y-auto">
          <CarDetails car={selectedCar} onCheckout={handleCheckout} />
        </div>
      </div>
    </div>
  );
}