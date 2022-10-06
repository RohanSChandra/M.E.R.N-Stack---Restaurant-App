const formatReservations = require("./formatReservations");

describe("formatReservations", () => {
  it("should format a Reservation from Mongoose to API spec", () => {
    const validReservations = {
      partySize: "Mock description",
      date: "Mock description",
      userId: "Mock description",
      restaurantName: "Mock description",
    };
    const received = formatReservations({
      _id: "abc",
      __v: "this-should-be-removed",
      ...validReservations,
    });
    const expected = {
      ...validReservations,
      id: "abc",
    };
    expect(received).toEqual(expected);
  });
});
