const express = require("express");
const router = express.Router();

const {
  login,
  register,
  dashboard,
  getAllUsers,
  forgotPassword,
  resetPassword,
  getTripData,
} = require("../controllers/user");

const {
  saveItinerary,
  getUserItineraries,
  getItineraryById,
} = require("../controllers/itinerary");
const authMiddleware = require("../middleware/auth");

router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:resetToken").post(resetPassword);
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/dashboard").get(authMiddleware, dashboard);
router.route("/users").get(getAllUsers);
router.route("/trip-data").post(getTripData);
router.route("/itinerary/save-itinerary").post(authMiddleware, saveItinerary);
router
  .route("/itinerary/user-itineraries")
  .get(authMiddleware, getUserItineraries);
router.route("/itinerary/:id").get(authMiddleware, getItineraryById);

module.exports = router;
