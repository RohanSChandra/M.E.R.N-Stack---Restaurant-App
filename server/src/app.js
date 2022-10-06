const express = require("express");
const cors = require("cors");
const { celebrate, Joi, errors, Segments } = require("celebrate");
const { auth } = require("express-oauth2-jwt-bearer");
const validId = require("./utils/validId");
const formatRestaurants = require("./formatRestaurants");
const formatReservations = require("./formatReservations");
const ReservationsModel = require("./models/ReservationModel");
const RestaurantsModel = require("./models/RestaurantModel");

const app = express();
const checkJwt = auth({
  audience: "https://reservationizr.com",
  issuerBaseURL: `https://dev-ciy2qr2q.au.auth0.com/`,
});

app.use(cors());
app.use(express.json());

app.post(
  "/reservations",
  checkJwt,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      partySize: Joi.number().min(1).required(),
      date: Joi.date().greater("now").required(),
      restaurantName: Joi.string().required(),
    }),
  }),
  async (request, response, next) => {
    try {
      const { body, auth } = request;
      const reservationBody = {
        userId: auth.payload.sub,
        ...body,
      };
      const reservation = new ReservationsModel(reservationBody);
      await reservation.save();
      return response.status(201).send(formatReservations(reservation));
    } catch (error) {
      error.status = 400;
      next(error);
    }
  }
);

app.get("/restaurants", async (request, response) => {
  const restaurants = await RestaurantsModel.find({});
  const formatedRestaurants = restaurants.map(formatRestaurants);
  response.status(200).send(formatedRestaurants);
});
app.get("/restaurants/:id", async (request, response) => {
  const { id } = request.params;
  if (validId(id)) {
    const restaurant = await RestaurantsModel.findById(id);

    if (restaurant) {
      return response.send(formatRestaurants(restaurant));
    } else {
      return response.status(404).send({ error: "restaurant not found" });
    }
  } else {
    return response.status(400).send({ error: "invalid id provided" });
  }
});

app.get("/reservations", checkJwt, async (request, response) => {
  const { auth } = request;
  const reservations = await ReservationsModel.find({
    userId: auth.payload.sub,
  });
  const formatedReservations = reservations.map(formatReservations);
  response.status(200).send(formatedReservations);
});

app.get("/reservations/:id", checkJwt, async (request, response) => {
  const { id } = request.params;
  const { auth } = request;

  if (validId(id)) {
    const reservation = await ReservationsModel.findById(id);

    if (reservation) {
      if (reservation.userId === auth.payload.sub) {
        return response.send(formatReservations(reservation));
      } else {
        return response
          .status(403)
          .send({
            error: "user does not have permission to access this reservation",
          });
      }
    } else {
      return response.status(404).send({ error: "not found" });
    }
  } else {
    return response.status(400).send({ error: "invalid id provided" });
  }
});
app.use(errors());

module.exports = app;
