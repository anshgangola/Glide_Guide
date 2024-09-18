import React from "react";
import "../styles/DisplayItinerary.css";
import Navbar from "./Navbar";

const DisplayContainer = ({
  weatherData,
  restaurantData,
  accommodationData,
  accommodationType,
  itineraryData,
}) => {
  const getAccommodationTitle = () => {
    switch (accommodationType?.toLowerCase()) {
      case "hotel":
      case "resort":
        return "Recommended Hotels/Resorts";
      case "camping":
        return "Recommended Campgrounds";
      case "homestay":
        return "Recommended Homestays";
      default:
        return "Recommended Accommodations";
    }
  };

  const findKey = (obj, keyToFind) => {
    return Object.keys(obj).find(
      (key) => key.toLowerCase() === keyToFind.toLowerCase()
    );
  };

  return (
    <div className="display-comp">
      <Navbar />
      <div className="title-container">
        <h1 className="itineary-title">
          <span className="title-prefix">Here's your trip details for </span>
          {weatherData.resolvedAddress.split(" ").map((word, index) => (
            <span key={index} className="location-word">
              {word}{" "}
            </span>
          ))}
        </h1>
      </div>

      <div className="weather-display">
        <div className="weather-comp">
          <h2 className="section-title">Weather Forecast</h2>
          <div className="weather-table-container">
            <table className="weather-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Temperature</th>
                  <th>Max Temp</th>
                  <th>Min Temp</th>
                  <th>Conditions</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {weatherData.days &&
                  weatherData.days.map((day, index) => (
                    <tr key={index} className="weather-row">
                      <td>{day.datetime}</td>
                      <td>{day.temp}°C</td>
                      <td>{day.tempmax}°C</td>
                      <td>{day.tempmin}°C</td>
                      <td>{day.conditions}</td>
                      <td>{day.description}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="itinerary-section-container">
          <div className="itinerary-section">
            <h2 className="section-title">Itinerary</h2>
            <div className="itinerary-timeline">
              {Object.entries(itineraryData)
                .filter(([key]) => key.startsWith("Day"))
                .map(([day, activities]) => (
                  <div key={day} className="itinerary-day">
                    <div className="day-marker">{day}</div>
                    <div className="activities">
                      <ul>
                        {activities.map((activity, index) => (
                          <li key={index} className="activity">
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="info-cards-container">
          <div className="info-card budget">
            <h2 className="section-title">Budget Calculation</h2>
            <ul>
              {(() => {
                const budgetKey = findKey(itineraryData, "Budget Calculation");
                return budgetKey && itineraryData[budgetKey]
                  ? itineraryData[budgetKey].map((item, index) => (
                      <li key={index}>{item}</li>
                    ))
                  : null;
              })()}
            </ul>
          </div>

          <div className="info-card tips">
            <h2 className="section-title">Travel Tips</h2>
            <ul>
              {(() => {
                const tipsKey = findKey(itineraryData, "Tips");
                return tipsKey && itineraryData[tipsKey]
                  ? itineraryData[tipsKey].map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))
                  : null;
              })()}
            </ul>
          </div>

          <div className="info-card food-areas">
            <h2 className="section-title">Popular Local Food Areas</h2>
            <ul>
              {(() => {
                const foodAreasKey = findKey(
                  itineraryData,
                  "Popular local food areas"
                );
                return foodAreasKey && itineraryData[foodAreasKey]
                  ? itineraryData[foodAreasKey].map((area, index) => (
                      <li key={index}>
                        {area.Name}: {area.Address}
                      </li>
                    ))
                  : null;
              })()}
            </ul>
          </div>
        </div>

        <div className="restaurants-section">
          <h2 className="section-title">Recommended Restaurants</h2>
          <div className="restaurant-grid">
            {restaurantData.map((restaurant, index) => (
              <div key={index} className="restaurant-card">
                <div className="restaurant-icon">🍽️</div>
                <h3 className="restaurant-name">{restaurant.name}</h3>
                <p className="restaurant-address">
                  <i className="fas fa-map-marker-alt"></i>{" "}
                  {restaurant.vicinity}
                </p>
                <div className="restaurant-rating">
                  <span
                    className="stars"
                    style={{ "--rating": restaurant.rating }}
                  >
                    ★★★★★
                  </span>
                  <span className="rating-number">{restaurant.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="accommodations-section">
          <h2 className="section-title">{getAccommodationTitle()}</h2>
          <div className="accommodation-grid">
            {accommodationData.map((place, index) => (
              <div key={index} className="accommodation-card">
                <div className="accommodation-icon">🏨</div>
                <h3 className="accommodation-name">{place.name}</h3>
                <p className="accommodation-address">
                  <i className="fas fa-map-marker-alt"></i> {place.vicinity}
                </p>
                <div className="accommodation-rating">
                  <span className="stars" style={{ "--rating": place.rating }}>
                    ★★★★★
                  </span>
                  <span className="rating-number">{place.rating}</span>
                </div>
                {place.url && (
                  <a
                    href={place.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-link"
                  >
                    <i className="fas fa-map-marked-alt"></i> View on Google
                    Maps
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="last-line">
          {" "}
          Let the world be your playground, and every destination a new chapter.
          Happy exploring!
        </p>
      </div>
    </div>
  );
};

export default DisplayContainer;
