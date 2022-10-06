import "./RestaurantList.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const RestaurantList = () => {
  const [restaurantList, setRestaurantList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/restaurants`
      );
      const data = await response.json();
      setRestaurantList(data);
    };
    fetchData();
  }, []);
  return (
    <>
      <h1>Restaurants</h1>
      <ul>
        {restaurantList.map((restaurant) => {
          return (
            <li key={restaurant.id} className="restaurant-list-grid-container">
              <img
                src={restaurant.image}
                className="restaurant-list-image"
                alt="pictureoffood"
              ></img>
              <div>
                <h2 className="restaurant-list-name">{restaurant.name}</h2>
                <p className="restaurant-list-description">
                  {restaurant.description}
                </p>
                <Link
                  className="restaurant-list-reserve-now"
                  to={`/restaurants/${restaurant.id}`}
                >
                  Reserve Now &rarr;
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default RestaurantList;
