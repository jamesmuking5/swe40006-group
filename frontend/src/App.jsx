import './App.css';
import CarList from './CarList';
import Cart from './Cart';
import { CartProvider } from './CartContext';

function App() {
  const appEnv = import.meta.env.VITE_APP_ENVIRONMENT;

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
          <p>This Web App is running on a <i>{appEnv}</i> server.</p>
        </footer>
      </div>
    </CartProvider>
  );
}

export default App;