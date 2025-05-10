// File: backend/src/index.js
// Description: This file is the entry point for the car shop application. It sets up the Express server, connects to MongoDB, and handles server shutdown gracefully.

import express from "express";
import dotenv from "dotenv";

// Import environment variables from .env file and always refresh
dotenv.config(".env", { override: true });
const serviceLocation = "Main Service";

// Import MongoDB connection function
import { connectToMongoDB } from "./database/mongodb.js";

const app = express();
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "localhost";

// Middleware to parse JSON requests
app.use(express.json());
// Middleware to parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));
// Middleware to serve static files from the 'public' directory
app.use(express.static("public"));

// Add parentheses to immediately invoke the async function
(async () => {
  try {
    // Connect to MongoDB
    await connectToMongoDB();
    console.log(`${serviceLocation}: MongoDB connection established`);

    // Declare server variable
    let server = app.listen(PORT, HOST, () => {
      console.log(
        `${serviceLocation}: Server is running at http://${HOST}:${PORT}`
      );
    });

    // Gracefully handle server shutdown
    const signals = ["SIGINT", "SIGTERM"];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        console.log(`${serviceLocation}: Received ${signal}. Shutting down...`);
        server.close(() => {
          console.log(`${serviceLocation}: Server closed`);
          process.exit(0);

          setTimeout(() => {
            console.error(
              `${serviceLocation}: Forcefully shutting down after timeout`
            );
            process.exit(1);
          }, 5); // 5 seconds timeout
        });
      });
    });
  } catch (error) {
    console.error(`${serviceLocation}: Error starting server: ${error}`);
  }
})();
