// File: carinfo.js
// Description: This file defines the routes for handling car information requests in the car shop application.

import express from "express";
const router = express.Router();
import { readCarData } from "../database/mongodb.js";

// Return a json object with car information
router.get("/getData", async (req, res) => {
  console.log(`Received request for car information from ${req.ip}`);
  try {
    const carInfo = await readCarData();
    if (!carInfo) {
      return res.status(404).json({ error: "Car information not found" });
    }
    res.status(200).json(carInfo);
  } catch (error) {
    console.error("Error fetching car information:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Export the router
export default router;