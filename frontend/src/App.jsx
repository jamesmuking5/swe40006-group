import './App.css';
import CarList from './CarList';
import Cart from './Cart';
import { CartProvider } from './CartContext';

function App() {
  return (
    <CartProvider>
      <div className="App">
        <header className="App-header">
          <h1>SWE40006 Car Shop Web App</h1>
        </header>
        <main>
          <div className="content-wrapper">
            <div className="car-list-wrapper">
              <CarList />
            </div>
            <div className="cart-wrapper">
              <Cart />
            </div>
          </div>
        </main>
        <footer>
          <p>&copy; {new Date().getFullYear()} Car Shop Demo - SWE40006 Group Project</p>
        </footer>
      </div>
    </CartProvider>
  );
}

export default App;