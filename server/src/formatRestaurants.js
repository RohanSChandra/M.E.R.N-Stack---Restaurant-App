const formatRestaurants = (restaurants) => {
  return {
    id: restaurants._id,
    name: restaurants.name,
    description: restaurants.description,
    image: restaurants.image,
  };
};

module.exports = formatRestaurants;
