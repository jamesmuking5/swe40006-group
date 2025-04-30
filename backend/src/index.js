import express from "express";
import dotenv from "dotenv";

// Import environment variables from .env file and always refresh
dotenv.config(".env", { override: true });

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

// Middleware to parse JSON requests
app.use(express.json());
// Middleware to parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));
// Middleware to serve static files from the 'public' directory
app.use(express.static("public"));

// Listen on the specified port and host
app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
