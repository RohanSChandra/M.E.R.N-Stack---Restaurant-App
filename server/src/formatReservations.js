const formatReservations = (reservation) => {
  return {
    id: reservation._id,
    partySize: reservation.partySize,
    date: reservation.date,
    userId: reservation.userId,
    restaurantName: reservation.restaurantName,
  };
};

module.exports = formatReservations;
