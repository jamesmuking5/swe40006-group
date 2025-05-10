// File: backend/__test__/mongodb.test.js
// Description: This file contains the test cases for the MongoDB connection logic in the car shop application.
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { connectToMongoDB, Car } from "../src/database/mongodb";

// Global variable declaration
let mongoServer;

// Setup a temporary in-memory MongoDB server before running tests
beforeAll(async () => {
  // Create the in-memory server
  mongoServer = await MongoMemoryServer.create();
  
  // Get the connection URI from the in-memory server
  const mongoUri = mongoServer.getUri();
  
  // Set environment variables for testing
  process.env.MONGODB_NAME = "test-database";
  process.env.MONGODB_URI = mongoUri;
  
  // Connect to the in-memory database
  await mongoose.connect(mongoUri);
});

// Cleanup after all tests are done
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

// Clear data between tests for all describe blocks
beforeEach(async () => {
  // Clear all collections more reliably
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// -- Main Test Suite --
describe("MongoDB Connection", () => {
  // --- connectToMongoDB function ---
  test("should connect to MongoDB", async () => {
    const connection = mongoose.connection;
    expect(connection.readyState).toBe(1); // 1 means connected
  });

  test("the initializing connectToMongoDB function should create default cars if the database is empty", async () => {
    // Run the initializing function which should create default cars
    await connectToMongoDB();
    // Check if the database is empty
    const count = await Car.countDocuments();
    expect(count).toBeGreaterThan(0); // Check if default cars are created
  });

  test("the initializing connectToMongoDB function should not create default cars if the database is not empty", async () => {
    // Create a car manually
    const car = new Car({ make: "Toyota", model: "Corolla", year: 2020, price: 20000 });
    await car.save();
    
    // Run the initializing function which should not create default cars
    await connectToMongoDB();
    
    // Check if the database is not empty
    const count = await Car.countDocuments();
    expect(count).toBe(1); // Check if no new cars are created
  });
});