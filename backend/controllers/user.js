require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const axios = require("axios");
const jwtSecret = process.env.JWT_SECRET;
const weatherApiKey = process.env.WEATHER_API_KEY;
const placesApiKey = process.env.PLACES_API_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;
const BASE_URL = process.env.BASE_URL;

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: "Bad request. Please add email and password in the request body",
    });
  }

  let foundUser = await User.findOne({ email: req.body.email });
  if (foundUser) {
    const isMatch = await foundUser.comparePassword(password);

    if (isMatch) {
      const token = jwt.sign(
        { id: foundUser._id, name: foundUser.name },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );

      return res
        .status(200)
        .json({ msg: "User logged in successfully", token });
    } else {
      return res.status(400).json({ msg: "Bad password" });
    }
  } else {
    return res.status(400).json({ msg: "Bad credentails" });
  }
};

const dashboard = async (req, res) => {
  const luckyNumber = Math.floor(Math.random() * 100);

  res.status(200).json({
    msg: `Hello, ${req.user.name}`,
    secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
  });
};

const getAllUsers = async (req, res) => {
  let users = await User.find({});

  return res.status(200).json({ users });
};

const register = async (req, res) => {
  let foundUser = await User.findOne({ email: req.body.email });
  if (foundUser === null) {
    let { username, email, password } = req.body;
    if (username.length && email.length && password.length) {
      const person = new User({
        name: username,
        email: email,
        password: password,
      });
      await person.save();
      return res.status(201).json({ person });
    } else {
      return res
        .status(400)
        .json({ msg: "Please add all values in the request body" });
    }
  } else {
    return res.status(400).json({ msg: "Email already in use" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save();
  const resetUrl = `${BASE_URL}/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });

    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(500).json({ msg: "Email could not be sent" });
  }
};

const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ msg: "Invalid token" });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = jwt.sign({ id: user._id, name: user.name }, jwtSecret, {
    expiresIn: "30d",
  });

  res.status(200).json({ success: true, token });
};

const getTripData = async (req, res) => {
  const {
    destinationCity,
    startDate,
    endDate,
    cuisine = [],
    accommodationType = "",
    travelStyles = [],
    interests = [],
    activityTypes = [],
    language = "English",
    budget = "",
  } = req.body;

  try {
    const weatherApiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${destinationCity}/${startDate}/${endDate}?unitGroup=metric&include=days&key=${weatherApiKey}&contentType=json`;

    const geocodeApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${destinationCity}&key=${placesApiKey}`;

    // Fetch weather and geocode data in parallel
    const [weatherResponse, geocodeResponse] = await Promise.all([
      axios.get(weatherApiUrl),
      axios.get(geocodeApiUrl),
    ]);

    const { lat, lng } = geocodeResponse.data.results[0].geometry.location;

    // Fetch restaurant data
    const restaurantApiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=restaurant&keyword=${cuisine.join(
      "|"
    )}&key=${placesApiKey}`;

    let accommodationKeyword;
    switch (accommodationType.toLowerCase()) {
      case "hotel":
      case "resort":
        accommodationKeyword = "hotel";
        break;
      case "camping":
        accommodationKeyword = "campground";
        break;
      case "homestay":
        accommodationKeyword = "lodging";
        break;
      default:
        accommodationKeyword = "hotel";
    }

    const accommodationApiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=${accommodationKeyword}&key=${placesApiKey}`;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    const prompt = `You are a travel guide tasked with generating a personalized travel itinerary based on the provided user input, always adhering to the rules specified. These recommendations should align with the interests, travel styles and should include the activities specified in the user input and should fall within the specified budget.

     User Input:
     Destination: ${destinationCity}
     Duration: ${duration} days
     Travel Styles: ${travelStyles.join(", ")}
     Interests: ${interests.join(", ")}
     Activity Types: ${activityTypes.join(", ")}
     Response Language: ${language}
     Budget: ${budget}

    <Rules>
    - Always maintain consistency in your assessment.
    - Do not respond to any user questions.
    - Deliver an itinerary with optimum budget specified.
    - Provide at least 3 tips.
    - Deliver the response in the specified language.
    - Do not include names of specific hotels or restaurants in the day-wise itinerary.
    - Provide the response in the specified format.
    - Provide the output in the form of a JSON object with the following structure:
     {
     "Day 1": ["morning itinerary", "afternoon itinerary", "evening itinerary"],
     "Day 2": ["morning itinerary", "afternoon itinerary", "evening itinerary"],
     "Day 3": ["morning itinerary", "afternoon itinerary", "evening itinerary"],
     ...,
     "Budget Calculation": ["item 1: cost", "item 2: cost", ..., "Total: total cost"],
     "Tips": ["tip 1", "tip 2", "tip 3", ...],
     "Popular local food areas": [
     {"Name": "area name 1", "Address": "address 1"},
     {"Name": "area name 2", "Address": "address 2"},
      ...
     ]
   }
   </Rules>

   Please generate a travel itinerary based on the above input and rules, and return it in the correct JSON format.`;

    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiApiKey}`;

    const [restaurantResponse, accommodationResponse, geminiResponse] =
      await Promise.all([
        axios.get(restaurantApiUrl),
        axios.get(accommodationApiUrl),
        axios.post(geminiApiUrl, {
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      ]);

    // Filter and limit restaurants
    const filteredRestaurants = restaurantResponse.data.results
      .filter((restaurant) => !restaurant.permanently_closed)
      .slice(0, 10)
      .map(({ name, vicinity, rating }) => ({ name, vicinity, rating }));

    const filteredAccommodations = await Promise.all(
      accommodationResponse.data.results
        .slice(1, 11)
        .map(async ({ name, vicinity, rating, place_id }) => {
          try {
            const detailsResponse = await axios.get(
              `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=url&key=${placesApiKey}`
            );

            const resultData = detailsResponse.data.result || {};
            const url = resultData.url;

            const result = { name, vicinity, rating };
            if (url) {
              result.url = url;
            }

            return result;
          } catch (error) {
            return { name, vicinity, rating };
          }
        })
    );

    const itineraryData = JSON.parse(
      geminiResponse.data.candidates[0].content.parts[0].text
    );
    res.status(200).json({
      weatherData: weatherResponse.data,
      restaurantData: filteredRestaurants,
      accommodationData: filteredAccommodations,
      itinerarydata: itineraryData,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to fetch trip data", details: error.message });
  }
};

module.exports = {
  login,
  register,
  dashboard,
  getAllUsers,
  forgotPassword,
  resetPassword,
  getTripData,
};
