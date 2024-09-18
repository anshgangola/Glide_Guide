import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/SavedItineraries.css";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const SavedItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("auth"));
        const response = await axios.get(
          `${baseUrl}/api/v1/itinerary/user-itineraries`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setItineraries(response.data.itineraries);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch itineraries");
        setLoading(false);
      }
    };
    fetchItineraries();
  }, []);

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="save-comp">
      <Navbar />
      <div className="saved-itineraries-container">
        <h1 className="saved-itineraries-title">My Saved Itineraries</h1>
        {itineraries.length === 0 ? (
          <p className="no-itineraries">No saved itineraries found.</p>
        ) : (
          <ul className="itinerary-list">
            {itineraries.map((itinerary, index) => (
              <li key={itinerary._id} className="itinerary-item">
                <div className="itinerary-number">{index + 1}</div>
                <div className="itinerary-details">
                  <h3 className="itinerary-name">
                    Trip to{" "}
                    {itinerary.weatherData?.resolvedAddress ||
                      itinerary.itineraryData?.destination ||
                      "Unknown Destination"}
                  </h3>
                  <p className="itinerary-date">
                    Created on{" "}
                    {new Date(itinerary.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  to={`/itinerary/${itinerary._id}`}
                  className="view-button"
                >
                  View Details
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SavedItineraries;
