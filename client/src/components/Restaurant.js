import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreateReservation from "./CreateReservation";
import "./Restaurant.css";

const Restaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const fetchUrl = `${process.env.REACT_APP_API_URL}/restaurants/${id}`;
      const response = await fetch(fetchUrl);
      const data = await response.json();
      setRestaurant(data);

      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div key={restaurant.id} className="restaurant-grid-container">
        <img
          src={restaurant.image}
          className="restaurant-image"
          alt="pictureoffood"
        ></img>
        <div>
          <h1 className="restaurant-name">{restaurant.name}</h1>
          <p className="restaurant-description">{restaurant.description}</p>
        </div>
      </div>
      <CreateReservation restaurantName={restaurant.name} />
    </>
  );
};

export default Restaurant;
