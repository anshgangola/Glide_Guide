require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connect");
const mainRouter = require("./routes/user");
const { forgotPassword, resetPassword } = require("./controllers/user");
const authMiddleware = require("./middleware/auth");
const {
  saveItinerary,
  getUserItineraries,
  getItineraryById,
} = require("./controllers/itinerary");

const app = express();
const port = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const BASE_URL = process.env.BASE_URL;

app.use(express.json());
app.use(
  cors({
    origin: BASE_URL,
    methods: "GET,POST",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.post("/api/v1/forgot-password", forgotPassword);
app.post("/api/v1/reset-password/:resetToken", resetPassword);
app.post("/api/v1/itinerary/save-itinerary", authMiddleware, saveItinerary);
app.get(
  "/api/v1/itinerary/user-itineraries",
  authMiddleware,
  getUserItineraries
);
app.get("/api/v1//itinerary/:id", authMiddleware, getItineraryById);

app.use("/api/v1", mainRouter);

const start = async () => {
  try {
    await connectDB(MONGODB_URI);
    app.listen(port, () => {});
  } catch (error) {
    console.log(error);
  }
};

start();
