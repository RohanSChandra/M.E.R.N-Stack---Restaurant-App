// FIXME: Add a Mongoose model here

const mongoose = require("mongoose");
const { Schema } = mongoose;

const reservationsSchema = new Schema({
  partySize: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  restaurantName: { type: String, required: true },
  userId: { type: String, required: true },
});

const ReservationsModel = mongoose.model("Reservation", reservationsSchema);
module.exports = ReservationsModel;
