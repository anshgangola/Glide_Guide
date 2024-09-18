import React, { useEffect, useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import mountainImage from "../assets/mountain.jpeg";
import beachImage from "../assets/beach.jpeg";
import Navbar from "./Navbar";
import natureImage from "../assets/nature.jpeg";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaLanguage,
  FaHotel,
} from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";

const Dashboard = () => {
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    sourceCity: "",
    destinationCity: "",
    startDate: "",
    endDate: "",
    budget: "",
    language: "",
    accommodationType: "",
    travelStyles: [],
    interests: [],
    activityTypes: [],
    cuisine: [],
  });
  const [minDate, setMinDate] = useState("");
  const backgroundImages = [mountainImage, beachImage, natureImage];
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const fetchName = async () => {
    let axiosConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/dashboard`,
        axiosConfig
      );
      setData({ msg: response.data.msg, luckyNumber: response.data.secret });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSourceCityChange = (address) => {
    setFormData((prevData) => ({ ...prevData, sourceCity: address }));
  };

  const handleDestinationCityChange = (address) => {
    setFormData((prevData) => ({ ...prevData, destinationCity: address }));
  };

  const handleSelect = (address, updateField) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        console.log("Success", latLng);
        updateField(address);
      })
      .catch((error) => console.error("Error", error));
  };

  const handleMultiSelectChange = (e, field) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field].includes(value)
        ? prevData[field].filter((item) => item !== value)
        : [...prevData[field], value],
    }));
  };

  const LoadingMessage = () => (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <p>Please wait while we plan your perfect trip...</p>
      </div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/api/v1/trip-data`, {
        destinationCity: formData.destinationCity,
        startDate: formData.startDate,
        endDate: formData.endDate,
        cuisine: formData.cuisine,
        accommodationType: formData.accommodationType,
        sourceCity: formData.sourceCity,
        travelStyles: formData.travelStyles,
        interests: formData.interests,
        activityTypes: formData.activityTypes,
        language: formData.language,
        budget: formData.budget,
      });

      setIsLoading(false);

      navigate("/display-itinerary", {
        state: {
          weatherData: response.data.weatherData,
          restaurantData: response.data.restaurantData,
          accommodationData: response.data.accommodationData,
          accommodationType: formData.accommodationType,
          itineraryData: response.data.itinerarydata,
        },
      });
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to fetch data. Please try again.");
    }
  };

  useEffect(() => {
    fetchName();
    if (token === "") {
      navigate("/login");
      toast.warn("Please login first to access dashboard");
    }

    const today = new Date().toISOString().split("T")[0];
    setMinDate(today);
    const intervalId = setInterval(() => {
      setCurrentBackgroundIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, [token, currentBackgroundIndex]);

  return (
    <div
      className="dashboard-main"
      style={{
        backgroundImage: `url(${backgroundImages[currentBackgroundIndex]})`,
      }}
    >
      <Navbar></Navbar>
      <div className="dashboard-content">
        <h1>Get Started Now</h1>
        <p>
          {data.msg}! Your adventure awaits. Fill out the form and let’s map out
          your next great journey!
        </p>
      </div>
      <div className="wrapper">
        <div className="form-box">
          <form onSubmit={handleSubmit}>
            <h1 className="form-title">Plan Your Trip</h1>
            <div className="city">
              <div className="input-box">
                <div className="icon-text">
                  <FaMapMarkerAlt className="icon" />
                  <p>Source city</p>
                </div>
                <div className="autocomplete-wrapper">
                  <PlacesAutocomplete
                    value={formData.sourceCity}
                    onChange={handleSourceCityChange}
                    onSelect={(address) =>
                      handleSelect(address, handleSourceCityChange)
                    }
                  >
                    {({
                      getInputProps,
                      suggestions,
                      getSuggestionItemProps,
                      loading,
                    }) => (
                      <div className="autocomplete-wrapper">
                        <input
                          {...getInputProps({
                            placeholder: "From",
                            className: "location-search-input",
                          })}
                        />
                        <div className="autocomplete-dropdown-container">
                          {loading && (
                            <div className="loading-suggestions">
                              Loading...
                            </div>
                          )}
                          {suggestions.map((suggestion) => {
                            const className = suggestion.active
                              ? "suggestion-item suggestion-item--active"
                              : "suggestion-item";
                            return (
                              <div
                                {...getSuggestionItemProps(suggestion, {
                                  className,
                                })}
                              >
                                <span>{suggestion.description}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </PlacesAutocomplete>
                </div>
              </div>

              <div className="input-box">
                <div className="icon-text">
                  <FaMapMarkerAlt className="icon" />
                  <p>Destination city</p>
                </div>
                <div className="autocomplete-wrapper">
                  <PlacesAutocomplete
                    value={formData.destinationCity}
                    onChange={handleDestinationCityChange}
                    onSelect={(address) =>
                      handleSelect(address, handleDestinationCityChange)
                    }
                  >
                    {({
                      getInputProps,
                      suggestions,
                      getSuggestionItemProps,
                      loading,
                    }) => (
                      <div className="autocomplete-wrapper">
                        <input
                          {...getInputProps({
                            placeholder: "From",
                            className: "location-search-input",
                          })}
                        />
                        <div className="autocomplete-dropdown-container">
                          {loading && (
                            <div className="loading-suggestions">
                              Loading...
                            </div>
                          )}
                          {suggestions.map((suggestion) => {
                            const className = suggestion.active
                              ? "suggestion-item suggestion-item--active"
                              : "suggestion-item";
                            return (
                              <div
                                {...getSuggestionItemProps(suggestion, {
                                  className,
                                })}
                              >
                                <span>{suggestion.description}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </PlacesAutocomplete>
                </div>
              </div>
            </div>

            <div className="city">
              <div className="input-box">
                <div className="icon-text">
                  <FaCalendarAlt className="icon" />
                  <p>Start date</p>
                </div>
                <input
                  type="date"
                  min={minDate}
                  name="startDate"
                  placeholder="Start Date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-box">
                <div className="icon-text">
                  <FaCalendarAlt className="icon" />
                  <p>End date</p>
                </div>
                <input
                  type="date"
                  min={minDate}
                  name="endDate"
                  placeholder="End Date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="city">
              <div className="input-box">
                <div className="icon-text">
                  <GiMoneyStack className="icon" style={{ fontSize: "25px" }} />
                  <p>Estimated Budget (with currency)</p>
                </div>
                <input
                  type="text"
                  placeholder="Enter amount"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-box">
                <div className="icon-text">
                  <FaLanguage className="icon" style={{ fontSize: "25px" }} />
                  <p>Language</p>
                </div>
                <input
                  type="text"
                  placeholder="Language"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="input-box">
              <div className="icon-text">
                <FaHotel className="icon" />
                <p>Accomodation Type</p>
              </div>
              <select
                name="accommodationType"
                className="accomodation"
                value={formData.accommodationType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select...</option>
                <option value="Hotel">Hotel</option>
                <option value="Resort">Resort</option>
                <option value="Camping">Camping</option>
                <option value="Homestay">Homestay</option>
              </select>
            </div>

            <div className="input-box">
              <label>Travel Styles:</label>
              <div className="multi-select">
                {[
                  "Cultural",
                  "Adventure",
                  "Relaxation",
                  "Beach",
                  "City",
                  "Safari",
                  "Ski",
                ].map((option) => (
                  <label key={option}>
                    <input
                      type="checkbox"
                      name="travelStyles"
                      value={option}
                      checked={formData.travelStyles.includes(option)}
                      onChange={(e) =>
                        handleMultiSelectChange(e, "travelStyles")
                      }
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="input-box">
              <label>Interests:</label>
              <div className="multi-select">
                {[
                  "History",
                  "Art",
                  "Food",
                  "Music",
                  "Nature",
                  "Sports",
                  "Photography",
                  "Architecture",
                  "Literature",
                  "Adventure",
                ].map((option) => (
                  <label key={option}>
                    <input
                      type="checkbox"
                      name="interests"
                      value={option}
                      checked={formData.interests.includes(option)}
                      onChange={(e) => handleMultiSelectChange(e, "interests")}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="input-box">
              <label>Activity Types:</label>
              <div className="multi-select">
                {[
                  "Outdoor",
                  "Sightseeing",
                  "Shopping",
                  "Nightlife",
                  "Museums",
                  "Yoga",
                  "Clubing",
                  "Gaming",
                ].map((option) => (
                  <label key={option}>
                    <input
                      type="checkbox"
                      name="activityTypes"
                      value={option}
                      checked={formData.activityTypes.includes(option)}
                      onChange={(e) =>
                        handleMultiSelectChange(e, "activityTypes")
                      }
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
            <div className="input-box">
              <label>Cuisine:</label>
              <div className="multi-select">
                {[
                  "Italian",
                  "Mexican",
                  "Chinese",
                  "Japanese",
                  "Indian",
                  "Thai",
                  "French",
                  "Korean",
                  "American",
                  "Mediterranean",
                ].map((option) => (
                  <label key={option}>
                    <input
                      type="checkbox"
                      name="cuisine"
                      value={option}
                      checked={formData.cuisine.includes(option)}
                      onChange={(e) => handleMultiSelectChange(e, "cuisine")}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" className="itineary-button">
              Generate your itineary
            </button>
          </form>
        </div>
      </div>
      {isLoading && <LoadingMessage />}
    </div>
  );
};

export default Dashboard;
