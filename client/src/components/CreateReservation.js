import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useAuth0 } from "@auth0/auth0-react";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateReservation.css";

const CreateReservation = ({ restaurantName }) => {
  const [date, setDate] = useState(new Date());
  const [partySize, setpartySize] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = await getAccessTokenSilently();
    setIsLoading(true);

    const formPage = { date, partySize, restaurantName };

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/reservations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formPage),
      }
    );
    if (!response.ok) {
      setIsError(true);
      setErrorStatus(response.status);
    } else {
      setIsLoading(false);
      navigate("/reservations");
    }
  };
  if (isError) {
    return (
      <>
        <p>Error creating a reservation (error status {errorStatus})</p>
        <Link to="/" className="button">
          Return to Restaurants
        </Link>
      </>
    );
  }

  return (
    <>
      <h2 className="reserve-restaurant">Reserve {restaurantName}</h2>
      <form onSubmit={handleSubmit}>
        <label className="form-label" htmlFor="numberofguests">
          Number of guests
        </label>
        <input
          type="number"
          id="numberofguests"
          min="0"
          className="form-input"
          required
          value={partySize}
          onChange={(e) => setpartySize(e.target.value)}
        />
        <label className="form-label" htmlFor="date">
          Date
        </label>
        <DatePicker
          className="form-input"
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          minDate={new Date()}
          showTimeSelect
          dateFormat="Pp"
        />
        <button className="create-reservations-submit-btn" disabled={isLoading}>
          Submit
        </button>
      </form>
    </>
  );
};

export default CreateReservation;
