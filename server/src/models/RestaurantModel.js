// FIXME: Add a Mongoose model here

const mongoose = require("mongoose");
const { Schema } = mongoose;

const restaurantsSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

const RestaurantsModel = mongoose.model("Restaurant", restaurantsSchema);
module.exports = RestaurantsModel;
