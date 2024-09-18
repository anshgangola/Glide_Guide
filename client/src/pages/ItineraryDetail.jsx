import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DisplayContainer from "./DisplayContainer";

const ItineraryDetail = () => {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("auth"));
        const response = await axios.get(`${baseUrl}/api/v1/itinerary/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItinerary(response.data.itinerary);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch itinerary");
        setLoading(false);
      }
    };
    fetchItinerary();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!itinerary) return <div>Itinerary not found</div>;

  return (
    <DisplayContainer
      weatherData={itinerary.weatherData}
      restaurantData={itinerary.restaurantData}
      accommodationData={itinerary.accommodationData}
      accommodationType={itinerary.accommodationType}
      itineraryData={itinerary.itineraryData}
    />
  );
};

export default ItineraryDetail;
