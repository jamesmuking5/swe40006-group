import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CarListingPage from "./pages/CarListingPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CarListingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
