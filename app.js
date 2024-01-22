// app.js

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3000 || process.env.PORT; // Change this to your desired port

// Middleware
app.use(cors());
app.use(bodyParser.json());

const mongodb_uri = process.env.MONGODB_URI;
// MongoDB connection
mongoose.connect(mongodb_uri);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define a mongoose schema for your data
const bookingSchema = new mongoose.Schema({
  customersname: String,
  email: String,
  address: String,
  arrivingTime: String,
  leavingTime: String,
  numberOfGuest: Number,
  placeName: String,
});

// Create a mongoose model based on the schema
const Booking = mongoose.model("Booking", bookingSchema);

// Route to handle POST requests
app.post("/bookings", async (req, res) => {
  try {
    const {
      customersname,
      email,
      address,
      arrivingTime,
      leavingTime,
      numberOfGuest,
      placeName,
    } = req.body;
    console.log(req.body);

    // Create a new booking document
    const newBooking = new Booking({
      customersname,
      email,
      address,
      arrivingTime,
      leavingTime,
      numberOfGuest,
      placeName,
    });

    // Save the booking to the database
    await newBooking.save();

    res.status(201).json({ message: "Booking saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
