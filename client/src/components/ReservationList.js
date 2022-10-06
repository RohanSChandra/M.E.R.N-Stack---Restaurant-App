import "./ReservationList.css";
import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { formatDate } from "../utils/formatDate";
import { Link } from "react-router-dom";

const ReservationList = () => {
  const [reservationList, setReservationList] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/reservations`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      setReservationList(data);
    };
    fetchData();
  }, [getAccessTokenSilently]);

  if (reservationList.length === 0) {
    return (
      <>
        <h1>Upcoming reservations</h1>
        <p>You don't have any reservations.</p>
        <Link to="/" className="reservation-list-view-details">
          View the restaurants
        </Link>
      </>
    );
  }

  return (
    <>
      <h1>Upcoming reservations</h1>
      <ul>
        {reservationList.map((reservation) => {
          return (
            <li
              key={reservation.id}
              className="reservation-list-grid-container"
            >
              <p className="reservation-list-name">
                {reservation.restaurantName}
              </p>

              <p className="reservation-list-date">
                {formatDate(reservation.date)}
              </p>
              <Link
                to={`/reservations/${reservation.id}`}
                className="reservation-list-view-details"
              >
                View details &rarr;
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default ReservationList;
