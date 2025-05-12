// File: backend/src/services/express-app.js
// Description: This file sets up the Express application, including middleware and routes.

import express from "express";

// Import routes
import carInfoRouter from "../routes/carinfo.js";

export default () => {
  const app = express();

  // Middleware to parse JSON requests
  app.use(express.json());
  // Middleware to parse URL-encoded requests
  app.use(express.urlencoded({ extended: true }));
  // Middleware to serve static files from the 'public' directory
  app.use(express.static("public"));

  // Simple response for the root route
  app.get("/", (req, res) => {
    res.send("Welcome to the Car Shop backend API");
  });

  // Use the carInfoRouter for the '/carinfo' route
  app.use("/carinfo", carInfoRouter);

  return app;
};
