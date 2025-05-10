// File: backend/src/database/mongodb.js
// Description: This file contains the MongoDB connection logic for the car shop application.

import mongoose from "mongoose";
import dotenv from "dotenv";

const serviceLocation = "Database Service";

// Load environment variables from .env file
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const MONGODB_NAME = process.env.MONGODB_NAME || "car-shop-database-dev";
const ENV = process.env.NODE_ENV || "development";
const FULL_MONGODB_URI = `${MONGODB_URI}/${MONGODB_NAME}`;

// Function to connect to MongoDB
export const connectToMongoDB = async () => {
  try {
    // Connect to MongoDB using the URI from environment variables
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(FULL_MONGODB_URI);
    }
    // Check if the connection is successful
    if (mongoose.connection.readyState === 1) {
      console.log(`${serviceLocation}: MongoDB connection established`);
    } else {
      console.error(`${serviceLocation}: MongoDB connection failed`);
    }
    // Check if the database is empty and create default cars if needed
    createDefaultCars();
    console.log(`${serviceLocation}: Connected to MongoDB at ${FULL_MONGODB_URI}`);
  } catch (error) {
    console.error(`${serviceLocation}: Error connecting to MongoDB:, ${error}`);
  }
};

// Create a Mongoose schema for cars
const carSchema = new mongoose.Schema({
  make: String,
  model: String,
  year: Number,
  price: Number,
});
// Create a Mongoose model for cars
export const Car = mongoose.model("Car", carSchema);

const createDefaultCars = async () => { 
  try {
    // Check if the database is empty
    const count = await Car.countDocuments();
    if (count === 0) {
      // Create default cars
      const defaultCars = [
        { make: "Toyota", model: "Corolla", year: 2020, price: 20000 },
        { make: "Honda", model: "Civic", year: 2021, price: 22000 },
        { make: "Ford", model: "Mustang", year: 2019, price: 26000 },
        { make: "Chevrolet", model: "Malibu", year: 2020, price: 21000 },
        { make: "Nissan", model: "Altima", year: 2022, price: 23000 },
        { make: "Hyundai", model: "Elantra", year: 2021, price: 19500 },
        { make: "BMW", model: "3 Series", year: 2018, price: 27000 },
        { make: "Mercedes-Benz", model: "C-Class", year: 2019, price: 29000 },
        { make: "Kia", model: "Forte", year: 2020, price: 18000 },
        { make: "Subaru", model: "Impreza", year: 2021, price: 20000 },
        { make: "Volkswagen", model: "Jetta", year: 2022, price: 22500 },
        { make: "Mazda", model: "Mazda3", year: 2020, price: 20500 },
        { make: "Tesla", model: "Model 3", year: 2021, price: 35000 },
      ];
      await Car.insertMany(defaultCars);
      console.log(`${serviceLocation}: Default cars created`);
    } else {
      console.log(`${serviceLocation}: Database already populated with default cars`);
    }
  }
  catch (error) {
    console.error(`${serviceLocation}: Error creating default cars: ${error}`);
  }
}