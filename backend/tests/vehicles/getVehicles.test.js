const request = require("supertest");
const app = require("../../src/app");
const Vehicle = require("../../src/models/Vehicle");
const User = require("../../src/models/User");
const { seedAdmin } = require("../../src/seeds/seedAdmin");

const adminCredentials = {
  email: "parimal3010@gmail.com",
  password: "123456",
};

const sampleVehicles = [
  {
    make: "Toyota",
    model: "Camry",
    year: 2023,
    price: 25000,
    mileage: 5000,
    color: "Silver",
    fuelType: "Gasoline",
    transmission: "Automatic",
  },
  {
    make: "Honda",
    model: "Civic",
    year: 2022,
    price: 22000,
    mileage: 12000,
    color: "Blue",
    fuelType: "Gasoline",
    transmission: "Manual",
  },
  {
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    price: 45000,
    mileage: 2000,
    color: "White",
    fuelType: "Electric",
    transmission: "Automatic",
  },
];

async function loginAsAdmin() {
  const response = await request(app)
    .post("/api/auth/login")
    .send(adminCredentials);

  return response.body.token;
}

async function loginAsRegularUser() {
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

describe("GET /api/vehicles", () => {
  beforeEach(async () => {
    await seedAdmin();
  });

  describe("successful retrieval", () => {
    it("should return empty list when no vehicles exist", async () => {
      const token = await loginAsRegularUser();

      const response = await request(app)
        .get("/api/vehicles")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Vehicles retrieved successfully");
      expect(response.body.vehicles).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    it("should return all vehicles with correct data", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = await loginAsRegularUser();

      const response = await request(app)
        .get("/api/vehicles")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Vehicles retrieved successfully");
      expect(response.body.vehicles).toHaveLength(3);
      expect(response.body.count).toBe(3);
    });

    it("should return vehicles with correct structure", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = await loginAsRegularUser();

      const response = await request(app)
        .get("/api/vehicles")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      const firstVehicle = response.body.vehicles[0];

      expect(firstVehicle).toHaveProperty("id");
      expect(firstVehicle).toHaveProperty("make");
      expect(firstVehicle).toHaveProperty("model");
      expect(firstVehicle).toHaveProperty("year");
      expect(firstVehicle).toHaveProperty("price");
      expect(firstVehicle).toHaveProperty("mileage");
      expect(firstVehicle).toHaveProperty("color");
      expect(firstVehicle).toHaveProperty("fuelType");
      expect(firstVehicle).toHaveProperty("transmission");
      expect(firstVehicle).toHaveProperty("createdAt");
    });

    it("should not include password field in vehicles", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = await loginAsRegularUser();

      const response = await request(app)
        .get("/api/vehicles")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      response.body.vehicles.forEach((vehicle) => {
        expect(vehicle).not.toHaveProperty("password");
      });
    });

    it("should return vehicles sorted by createdAt in descending order", async () => {
      const vehicle1 = await Vehicle.create(sampleVehicles[0]);
      await new Promise((resolve) => setTimeout(resolve, 10)); // Small delay

      const vehicle2 = await Vehicle.create(sampleVehicles[1]);
      const token = await loginAsRegularUser();

      const response = await request(app)
        .get("/api/vehicles")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles[0].id).toEqual(vehicle2._id.toString());
      expect(response.body.vehicles[1].id).toEqual(vehicle1._id.toString());
    });
  });

  describe("pagination", () => {
    it("should return paginated results with limit and skip", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = await loginAsRegularUser();

      const response = await request(app)
        .get("/api/vehicles?limit=2&skip=0")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toHaveLength(2);
    });

    it("should skip vehicles with skip parameter", async () => {
      const insertedVehicles = await Vehicle.insertMany(sampleVehicles);
      const token = await loginAsRegularUser();

      const response = await request(app)
        .get("/api/vehicles?limit=10&skip=1")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toHaveLength(2);
      expect(response.body.vehicles[0].id).toEqual(
        insertedVehicles[2]._id.toString(),
      );
    });

    it("should return count of total vehicles available", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = await loginAsRegularUser();

      const response = await request(app)
        .get("/api/vehicles?limit=1&skip=0")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toHaveLength(1);
      expect(response.body.totalCount).toBe(3);
    });
  });

  describe("authorization", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get("/api/vehicles");

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(
        /token|unauthorized|authentication/i,
      );
    });

    it("should return 401 when invalid token is provided", async () => {
      const response = await request(app)
        .get("/api/vehicles")
        .set("Authorization", "Bearer invalid.token.here");

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(
        /token|unauthorized|authentication/i,
      );
    });

    it("should allow both admin and regular users to access vehicles", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const adminToken = await loginAsAdmin();
      const userToken = await loginAsRegularUser();

      const adminResponse = await request(app)
        .get("/api/vehicles")
        .set("Authorization", `Bearer ${adminToken}`);

      const userResponse = await request(app)
        .get("/api/vehicles")
        .set("Authorization", `Bearer ${userToken}`);

      expect(adminResponse.status).toBe(200);
      expect(userResponse.status).toBe(200);
      expect(adminResponse.body.vehicles).toHaveLength(3);
      expect(userResponse.body.vehicles).toHaveLength(3);
    });
  });

  describe("filtering and sorting", () => {
    it("should handle invalid limit parameter gracefully", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = await loginAsRegularUser();

      const response = await request(app)
        .get("/api/vehicles?limit=invalid")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      // Should use default limit or return all
      expect(response.body.vehicles).toBeDefined();
    });

    it("should handle invalid skip parameter gracefully", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = await loginAsRegularUser();

      const response = await request(app)
        .get("/api/vehicles?skip=invalid")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toBeDefined();
    });
  });
});
