// File: backend/__tests__/carinfo.test.js
// Description: Unit tests for car info routes

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { connectToMongoDB, Car } from "../src/database/mongodb";
// Import jest for mocking (have to because I am using ESM import)
import { jest } from "@jest/globals";

// Import request for HTTP testing and app creator
import request from "supertest";
import createApp from "../src/services/express-app.js"; // Import the app creator

// Suppress console output during tests
console.log = jest.fn();
console.error = jest.fn();

// Global variable declaration
let mongoServer;
let server;

// Setup temporary in-memory MongoDB server and app before running tests
beforeAll(async () => {
  // Create the in-memory server
  mongoServer = await MongoMemoryServer.create();

  // Get the connection URI from the in-memory server
  const mongoUri = mongoServer.getUri();

  // Set environment variables for testing
  process.env.MONGODB_NAME = "test-database";
  process.env.MONGODB_URI = mongoUri;
  const HOST = "localhost";
  const PORT = 8001;

  // Connect to the in-memory database
  await mongoose.connect(mongoUri);

  // Run connectToMongoDB to create default cars
  await connectToMongoDB();

  // Listen to the server
  const app = createApp();
  server = app.listen(PORT, HOST);
});

// Cleanup after all tests are done
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }

  // Close the server
  if (server) {
    await server.close();
  }
});

// -- Main Test Suite --
describe("Car Info Routes", () => {
  // -- GET root route --
  test("should return a welcome message", async () => {
    // Make a GET request to the root endpoint
    const response = await request(server).get("/");

    // Check the response status and body
    expect(response.status).toBe(200);
    expect(response.text).toBe("Welcome to the Car Shop backend API");
  });

  // -- GET /carinfo --
  test("should return all car info", async () => {
    // Make a GET request to the host:port/carInfo/getData endpoint
    const response = await request(server).get(`/carInfo/getData`);

    // Check the response status and body
    expect(response.status).toBe(200);
    expect(response.body[0].make).toBe("Toyota");
    expect(response.body[0].model).toBe("Corolla");
    expect(response.body[0].year).toBe(2020);
    expect(response.body[0].price).toBe(20000);
    // Check the length of the response
    expect(response.body.length).toBe(13); // Check if 12 default cars are created
  });
});
