import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import "./Reservation.css";

const Reservation = () => {
  const { id } = useParams();
  const [reservation, setReservation] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessTokenSilently();
      const fetchUrl = `${process.env.REACT_APP_API_URL}/reservations/${id}`;
      const response = await fetch(fetchUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setReservation(data);

      setIsLoading(false);
    };
    fetchData();
  }, [id, getAccessTokenSilently]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (reservation.error) {
    return (
      <>
        <h3 className="error-message">Sorry! We can't find that reservation</h3>
        <Link to="/reservations" className="reservation-only-button">
          &larr; Back to reservations
        </Link>
      </>
    );
  }
  return (
    <>
      <div key={reservation.id}>
        <div>
          <h2>{reservation.restaurantName}</h2>
          <p>{formatDate(reservation.date)}</p>
          <p className="reservation-only-party-size">
            <strong> Party Size: </strong> {reservation.partySize}
          </p>

          <Link to="/reservations" className="reservation-only-button">
            &larr; Back to reservations
          </Link>
        </div>
      </div>
    </>
  );
};

export default Reservation;
