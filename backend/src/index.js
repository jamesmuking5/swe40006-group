// File: backend/src/index.js
// Description: This file is the entry point for the car shop application. It sets up the Express server, connects to MongoDB, and handles server shutdown gracefully.

// Import necessary modules
import dotenv from "dotenv";

// Import environment variables from .env file and always refresh
dotenv.config(".env", { override: true });
const serviceLocation = "Main Service";

// Import MongoDB connection function
import { connectToMongoDB } from "./database/mongodb.js";

// Import Express App from express-app.js
import expressApp from "./services/express-app.js";

const app = expressApp();
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "localhost";

/**
 * Starts the server and listens on the specified host and port.
 *
 * @constant {Object} server - The server instance created by the application.
 * @callback serverCallback
 * @param {string} serviceLocation - The location or name of the service.
 * @param {string} HOST - The hostname or IP address the server will bind to.
 * @param {number} PORT - The port number the server will listen on.
 * @returns {void} Logs the server's running status and URL to the console.
 */
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
