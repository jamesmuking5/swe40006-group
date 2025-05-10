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
/**
 * Connects to a MongoDB database using the URI from environment variables.
 *
 * This function attempts to establish a connection to MongoDB. If the connection
 * is successful, it logs a success message. If the connection fails, it logs an
 * error message. Additionally, it checks if the database is empty and creates
 * default cars if necessary.
 *
 * @async
 * @function
 * @throws {Error} Logs an error message if the connection to MongoDB fails.
 */
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
    console.log(
      `${serviceLocation}: Connected to MongoDB at ${FULL_MONGODB_URI}`
    );
  } catch (error) {
    console.error(`${serviceLocation}: Error connecting to MongoDB:, ${error}`);
  }
};

/**
 * Schema definition for a car in the MongoDB database.
 *
 * @typedef {Object} CarSchema
 * @property {string} make - The manufacturer of the car.
 * @property {string} model - The model of the car.
 * @property {number} year - The year the car was manufactured.
 * @property {number} price - The price of the car.
 */
const carSchema = new mongoose.Schema({
  make: String,
  model: String,
  year: Number,
  price: Number,
});
// Create a Mongoose model for cars
export const Car = mongoose.model("Car", carSchema);

/**
 * Asynchronously creates default car entries in the database if it is empty.
 *
 * This function checks the number of documents in the `Car` collection. If the collection
 * is empty, it populates the database with a predefined list of default car objects.
 * Logs messages to indicate whether the database was populated or already contained data.
 *
 * @async
 * @function createDefaultCars
 * @throws {Error} Logs an error message if an issue occurs while creating default cars.
 */
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
      console.log(
        `${serviceLocation}: Database already populated with default cars`
      );
    }
  } catch (error) {
    console.error(`${serviceLocation}: Error creating default cars: ${error}`);
  }
};

// Function to read the car data from the database
/**
 * Reads car data from the database.
 *
 * @async
 * @function readCarData
 * @returns {Promise<Array>} A promise that resolves to an array of car data.
 * @throws {Error} Throws an error if there is an issue reading car data from the database.
 */
export const readCarData = async () => { 
  try {
    const cars = await Car.find();
    return cars;
  } catch (error) {
    console.error(`${serviceLocation}: Error reading car data: ${error}`);
    throw error;
  }
}