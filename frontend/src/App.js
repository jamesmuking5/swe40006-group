// src/App.js
import React from 'react';
import './App.css';
import CarList from './CarList'; // Import the CarList component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Online Shopping Web App for Cars - A MERN demonstration</h1>
      </header>
      <main>
        <CarList />
      </main>
    </div>
  );
}

export default App;