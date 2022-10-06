const formatRestaurants = require("./formatRestaurants");

describe("formatRestaurants", () => {
  it("should format a Restaurant from Mongoose to API spec", () => {
    const validRestaurants = {
      name: "Mock description",
      description: "Mock description",
      image: "Mock description",
    };
    const received = formatRestaurants({
      _id: "abc",
      __v: "this-should-be-removed",
      ...validRestaurants,
    });
    const expected = {
      ...validRestaurants,
      id: "abc",
    };
    expect(received).toEqual(expected);
  });
});
