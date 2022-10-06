const request = require("supertest");
const app = require("./app");

describe("app", () => {
  it("POST /reservations creates a new reservation and return with a 201 status", async () => {
    const body = {
      partySize: 2,
      date: "2052-04-22T12:00:00.000Z",
      restaurantName: "test restaurant",
    };

    await request(app)
      .post("/reservations")
      .send(body)
      .expect(201)
      .expect((response) => {
        expect(response.body).toEqual(expect.objectContaining(body));
        expect(response.body.id).toBeTruthy();
      });
  });
  it("POST /reservations returns a 400 when an invalid request body is provided", async () => {
    const expectedStatus = 400;
    const body = {};

    await request(app).post("/reservations").send(body).expect(expectedStatus);
  });
  it("POST /reservations returns a 400 when a past date is provided", async () => {
    const expectedStatus = 400;
    const body = {
      partySize: 2,
      date: "1995-04-22T12:00:00.000Z",
      restaurantName: "test restaurant",
    };

    await request(app).post("/reservations").send(body).expect(expectedStatus);
  });
  it("POST /reservations returns a 400 when partySize is less than or equal to 0", async () => {
    const expectedStatus = 400;
    const body = {
      partySize: 0,
      date: "2052-04-22T12:00:00.000Z",
      restaurantName: "test restaurant",
    };

    await request(app).post("/reservations").send(body).expect(expectedStatus);
  });
  it("should return all restaurants from GET/restaurants with a 200 status", async () => {
    await request(app)
      .get("/restaurants")
      .expect((response) => {
        const expected = [
          {
            id: "616005cae3c8e880c13dc0b9",
            name: "Curry Place",
            description:
              "Bringing you the spirits of India in the form of best authentic grandma's recipe dishes handcrafted with love by our chefs!",
            image: "https://i.ibb.co/yftcRcF/indian.jpg",
          },
          {
            id: "616005e26d59890f8f1e619b",
            name: "Thai Isaan",
            description:
              "We offer guests a modern dining experience featuring the authentic taste of Thailand. Food is prepared fresh from quality ingredients and presented with sophisticated elegance in a stunning dining setting filled with all the richness of Thai colour, sound and art.",
            image: "https://i.ibb.co/HPjd2jR/thai.jpg",
          },
          {
            id: "616bd284bae351bc447ace5b",
            name: "Italian Feast",
            description:
              "From the Italian classics, to our one-of-a-kind delicious Italian favourites, all of our offerings are handcrafted from the finest, freshest ingredients available locally. Whether you're craving Italian comfort food like our Ravioli, Pappardelle or something with a little more Flavour like our famous Fettuccine Carbonara.",
            image: "https://i.ibb.co/0r7ywJg/italian.jpg",
          },
        ];
        expect(response.body).toEqual(expected);
        expect(response.status).toBe(200);
      });
  });
  it("should return a restaurant from GET/restaurants:id with a 200 status", async () => {
    await request(app)
      .get("/restaurants/616005cae3c8e880c13dc0b9")
      .expect((response) => {
        const expected = {
          id: "616005cae3c8e880c13dc0b9",
          name: "Curry Place",
          description:
            "Bringing you the spirits of India in the form of best authentic grandma's recipe dishes handcrafted with love by our chefs!",
          image: "https://i.ibb.co/yftcRcF/indian.jpg",
        };
        expect(response.body).toEqual(expected);
        expect(response.status).toBe(200);
      });
  });
  it("should return an invalid id message GET/restaurants/:id with a 400 status", async () => {
    await request(app)
      .get("/restaurants/invalid-id")
      .expect((response) => {
        const expected = { error: "invalid id provided" };
        expect(response.body).toEqual(expected);
        expect(response.status).toBe(400);
      });
  });
  it("should return a not found message GET/restaurants/:id with a 404 status", async () => {
    await request(app)
      .get("/restaurants/614abf0a93e8e80ace792ac9")
      .expect((response) => {
        const expected = { error: "restaurant not found" };
        expect(response.body).toEqual(expected);
        expect(response.status).toBe(404);
      });
  });
  it("should return all reservations for a specific userId from GET/reservations with a 200 status", async () => {
    await request(app)
      .get("/reservations")
      .expect((response) => {
        const expected = [
          {
            id: "507f1f77bcf86cd799439011",
            partySize: 4,
            date: "2023-11-17T06:30:00.000Z",
            userId: "mock-user-id",
            restaurantName: "Island Grill",
          },
          {
            id: "614abf0a93e8e80ace792ac6",
            partySize: 2,
            date: "2023-12-03T07:00:00.000Z",
            userId: "mock-user-id",
            restaurantName: "Green Curry",
          },
        ];
        expect(response.body).toEqual(expected);
        expect(response.status).toBe(200);
      });
  });
});
it("should return a single reservation from GET/reservations with a 200 status", async () => {
  await request(app)
    .get("/reservations/507f1f77bcf86cd799439011")
    .expect((response) => {
      const expected = {
        id: "507f1f77bcf86cd799439011",
        partySize: 4,
        date: "2023-11-17T06:30:00.000Z",
        userId: "mock-user-id",
        restaurantName: "Island Grill",
      };

      expect(response.body).toEqual(expected);
      expect(response.status).toBe(200);
    });
});
it("should return a error message GET/reservations/:id with a 403 status", async () => {
  await request(app)
    .get("/reservations/61679189b54f48aa6599a7fd")
    .expect((response) => {
      const expected = {
        error: "user does not have permission to access this reservation",
      };
      expect(response.body).toEqual(expected);
      expect(response.status).toBe(403);
    });
});
it("should return a not found message GET/reservations/:id with a 404 status", async () => {
  await request(app)
    .get("/reservations/614abf0a93e8e80ace792ac9")
    .expect((response) => {
      const expected = { error: "not found" };
      expect(response.body).toEqual(expected);
      expect(response.status).toBe(404);
    });
});
it("should return an invalid id message GET/reservations/:id with a 400 status", async () => {
  await request(app)
    .get("/reservations/invalid-id")
    .expect((response) => {
      const expected = { error: "invalid id provided" };
      expect(response.body).toEqual(expected);
      expect(response.status).toBe(400);
    });
});
