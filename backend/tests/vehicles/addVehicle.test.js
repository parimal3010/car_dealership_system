const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../src/app");
const User = require("../../src/models/User");
const Vehicle = require("../../src/models/Vehicle");
const { seedAdmin } = require("../../src/seeds/seedAdmin");

const ADMIN_EMAIL = "parimal3010@gmail.com";
const ADMIN_PASSWORD = "123456";

const validVehicle = {
  make: "Toyota",
  model: "Camry",
  year: 2023,
  price: 25000,
  mileage: 5000,
  color: "Silver",
  fuelType: "Gasoline",
  transmission: "Automatic",
};

async function loginAsAdmin() {
  const response = await request(app)
    .post("/api/auth/login")
    .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });

  return response.body.token;
}

async function createRegularUser() {
  const user = await User.create({
    name: "Regular User",
    email: "user@example.com",
    password: "password123",
    role: "user",
  });

  const loginResponse = await request(app)
    .post("/api/auth/login")
    .send({ email: user.email, password: "password123" });

  return loginResponse.body.token;
}

describe("POST /api/vehicles", () => {
  beforeEach(async () => {
    await seedAdmin();
  });

  describe("successful vehicle creation", () => {
    it("should create a new vehicle when admin is authenticated", async () => {
      const adminToken = await loginAsAdmin();

      const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(validVehicle);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Vehicle added successfully");
      expect(response.body.vehicle).toMatchObject({
        make: validVehicle.make,
        model: validVehicle.model,
        year: validVehicle.year,
        price: validVehicle.price,
        mileage: validVehicle.mileage,
        color: validVehicle.color,
        fuelType: validVehicle.fuelType,
        transmission: validVehicle.transmission,
      });
      expect(response.body.vehicle.id).toBeDefined();
    });

    it("should persist vehicle to database", async () => {
      const adminToken = await loginAsAdmin();

      await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(validVehicle);

      const savedVehicle = await Vehicle.findOne({ make: validVehicle.make });

      expect(savedVehicle).not.toBeNull();
      expect(savedVehicle.make).toBe(validVehicle.make);
      expect(savedVehicle.model).toBe(validVehicle.model);
    });
  });

  describe("authorization", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app)
        .post("/api/vehicles")
        .send(validVehicle);

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(
        /token|unauthorized|authentication/i,
      );
    });

    it("should return 401 when invalid token is provided", async () => {
      const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", "Bearer invalid.token.here")
        .send(validVehicle);

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(
        /token|unauthorized|authentication/i,
      );
    });

    it("should return 403 when regular user tries to add vehicle", async () => {
      const userToken = await createRegularUser();

      const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${userToken}`)
        .send(validVehicle);

      expect(response.status).toBe(403);
      expect(response.body.message).toMatch(/admin|forbidden|permission/i);
    });
  });

  describe("validation errors", () => {
    it("should return 400 when make is missing", async () => {
      const adminToken = await loginAsAdmin();
      const { make, ...vehicleWithoutMake } = validVehicle;

      const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(vehicleWithoutMake);

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/make/i);
    });

    it("should return 400 when model is missing", async () => {
      const adminToken = await loginAsAdmin();
      const { model, ...vehicleWithoutModel } = validVehicle;

      const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(vehicleWithoutModel);

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/model/i);
    });

    it("should return 400 when year is missing", async () => {
      const adminToken = await loginAsAdmin();
      const { year, ...vehicleWithoutYear } = validVehicle;

      const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(vehicleWithoutYear);

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/year/i);
    });

    it("should return 400 when price is missing", async () => {
      const adminToken = await loginAsAdmin();
      const { price, ...vehicleWithoutPrice } = validVehicle;

      const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(vehicleWithoutPrice);

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/price/i);
    });

    it("should return 400 when year is not a valid number", async () => {
      const adminToken = await loginAsAdmin();

      const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ ...validVehicle, year: "not-a-year" });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/year/i);
    });

    it("should return 400 when price is negative", async () => {
      const adminToken = await loginAsAdmin();

      const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ ...validVehicle, price: -5000 });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/price/i);
    });

    it("should return 400 when year is in the future", async () => {
      const adminToken = await loginAsAdmin();
      const futureYear = new Date().getFullYear() + 1;

      const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ ...validVehicle, year: futureYear });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/year/i);
    });
  });
});
