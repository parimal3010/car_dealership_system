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
  {
    make: "Toyota",
    model: "Prius",
    year: 2021,
    price: 28000,
    mileage: 30000,
    color: "Green",
    fuelType: "Hybrid",
    transmission: "Automatic",
  },
  {
    make: "Ford",
    model: "Mustang",
    year: 2023,
    price: 50000,
    mileage: 1000,
    color: "Red",
    fuelType: "Gasoline",
    transmission: "Manual",
  },
];

let adminToken;
let regularUserToken;

const loginAsAdmin = async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .send(adminCredentials);
  return response.body.token;
};

const createRegularUser = async () => {
  const userData = {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
  };
  await request(app).post("/api/auth/register").send(userData);
  const loginResponse = await request(app)
    .post("/api/auth/login")
    .send({ email: userData.email, password: userData.password });
  return loginResponse.body.token;
};

beforeAll(async () => {
  await seedAdmin();
  adminToken = await loginAsAdmin();
  regularUserToken = await createRegularUser();
});

describe("GET /api/vehicles/search", () => {
  describe("search by make", () => {
    it("should find vehicles by make (case-insensitive)", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = regularUserToken;

      const response = await request(app)
        .get("/api/vehicles/search?make=toyota")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toHaveLength(2);
      expect(response.body.vehicles.every((v) => v.make === "Toyota")).toBe(
        true,
      );
      expect(response.body.count).toBe(2);
    });

    it("should return empty array when no vehicles match make", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = regularUserToken;

      const response = await request(app)
        .get("/api/vehicles/search?make=BMW")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toHaveLength(0);
      expect(response.body.count).toBe(0);
    });
  });

  describe("search by model", () => {
    it("should find vehicles by model (case-insensitive)", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = regularUserToken;

      const response = await request(app)
        .get("/api/vehicles/search?model=camry")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toHaveLength(1);
      expect(response.body.vehicles[0].model).toBe("Camry");
    });

    it("should return empty array when no vehicles match model", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = regularUserToken;

      const response = await request(app)
        .get("/api/vehicles/search?model=Accord")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toHaveLength(0);
    });
  });

  describe("search by fuel type", () => {
    it("should find vehicles by fuelType (case-insensitive)", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = regularUserToken;

      const response = await request(app)
        .get("/api/vehicles/search?fuelType=gasoline")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toHaveLength(3);
      expect(
        response.body.vehicles.every((v) => v.fuelType === "Gasoline"),
      ).toBe(true);
    });

    it("should find electric vehicles", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = regularUserToken;

      const response = await request(app)
        .get("/api/vehicles/search?fuelType=electric")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toHaveLength(1);
      expect(response.body.vehicles[0].make).toBe("Tesla");
    });
  });

  describe("search by price range", () => {
    it("should find vehicles within minPrice and maxPrice", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = regularUserToken;

      const response = await request(app)
        .get("/api/vehicles/search?minPrice=20000&maxPrice=30000")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toHaveLength(3);
      expect(
        response.body.vehicles.every(
          (v) => v.price >= 20000 && v.price <= 30000,
        ),
      ).toBe(true);
    });

    it("should find vehicles with only minPrice", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = regularUserToken;

      const response = await request(app)
        .get("/api/vehicles/search?minPrice=40000")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toHaveLength(2);
      expect(response.body.vehicles.every((v) => v.price >= 40000)).toBe(true);
    });

    it("should find vehicles with only maxPrice", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = regularUserToken;

      const response = await request(app)
        .get("/api/vehicles/search?maxPrice=25000")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles.every((v) => v.price <= 25000)).toBe(true);
    });

    it("should handle invalid price range (negative prices)", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = regularUserToken;

      const response = await request(app)
        .get("/api/vehicles/search?minPrice=-5000")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      // Should treat negative as 0
      expect(response.body.vehicles.length).toBeGreaterThan(0);
    });

    it("should return empty array when price range has no matches", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = regularUserToken;

      const response = await request(app)
        .get("/api/vehicles/search?minPrice=100000&maxPrice=200000")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toHaveLength(0);
    });
  });

  describe("search by year", () => {
    it("should find vehicles by exact year", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = regularUserToken;

      const response = await request(app)
        .get("/api/vehicles/search?year=2023")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toHaveLength(3);
      expect(response.body.vehicles.every((v) => v.year === 2023)).toBe(true);
    });

    it("should return empty array when year has no matches", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = regularUserToken;

      const response = await request(app)
        .get("/api/vehicles/search?year=2020")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toHaveLength(0);
    });
  });

  describe("combined search filters", () => {
    it("should search with make and fuelType", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = regularUserToken;

      const response = await request(app)
        .get("/api/vehicles/search?make=toyota&fuelType=gasoline")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toHaveLength(1);
      expect(response.body.vehicles[0].model).toBe("Camry");
    });

    it("should search with price range and fuel type", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = regularUserToken;

      const response = await request(app)
        .get(
          "/api/vehicles/search?minPrice=20000&maxPrice=30000&fuelType=gasoline",
        )
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toHaveLength(1);
      expect(response.body.vehicles[0].model).toBe("Camry");
    });

    it("should search with year, make, and price range", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = regularUserToken;

      const response = await request(app)
        .get(
          "/api/vehicles/search?year=2023&make=toyota&minPrice=20000&maxPrice=30000",
        )
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toHaveLength(1);
      expect(response.body.vehicles[0].model).toBe("Camry");
    });

    it("should return empty array when combined filters have no matches", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = regularUserToken;

      const response = await request(app)
        .get("/api/vehicles/search?make=toyota&fuelType=electric")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toHaveLength(0);
    });
  });

  describe("pagination with search", () => {
    it("should apply limit and skip to search results", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = regularUserToken;

      const response = await request(app)
        .get("/api/vehicles/search?fuelType=gasoline&limit=2&skip=0")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toHaveLength(2);
      expect(response.body.totalCount).toBe(3);
    });

    it("should skip vehicles in search results", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = regularUserToken;

      const response = await request(app)
        .get("/api/vehicles/search?fuelType=gasoline&limit=10&skip=1")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toHaveLength(2);
    });
  });

  describe("authorization", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app)
        .get("/api/vehicles/search?make=toyota")
        .set("Authorization", "");

      expect(response.status).toBe(401);
    });

    it("should return 401 when invalid token is provided", async () => {
      const response = await request(app)
        .get("/api/vehicles/search?make=toyota")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
    });

    it("should allow both admin and regular users to search", async () => {
      await Vehicle.insertMany(sampleVehicles);

      const adminResponse = await request(app)
        .get("/api/vehicles/search?make=toyota")
        .set("Authorization", `Bearer ${adminToken}`);

      const userResponse = await request(app)
        .get("/api/vehicles/search?make=toyota")
        .set("Authorization", `Bearer ${regularUserToken}`);

      expect(adminResponse.status).toBe(200);
      expect(userResponse.status).toBe(200);
      expect(adminResponse.body.vehicles).toEqual(userResponse.body.vehicles);
    });
  });

  describe("response format", () => {
    it("should return properly formatted vehicle objects", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = regularUserToken;

      const response = await request(app)
        .get("/api/vehicles/search?make=tesla")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("vehicles");
      expect(response.body).toHaveProperty("count");
      expect(response.body).toHaveProperty("totalCount");

      const vehicle = response.body.vehicles[0];
      expect(vehicle).toHaveProperty("id");
      expect(vehicle).toHaveProperty("make");
      expect(vehicle).toHaveProperty("model");
      expect(vehicle).toHaveProperty("year");
      expect(vehicle).toHaveProperty("price");
      expect(vehicle).toHaveProperty("mileage");
      expect(vehicle).toHaveProperty("color");
      expect(vehicle).toHaveProperty("fuelType");
      expect(vehicle).toHaveProperty("transmission");
      expect(vehicle).toHaveProperty("createdAt");
      expect(vehicle).not.toHaveProperty("__v");
      expect(vehicle).not.toHaveProperty("password");
    });

    it("should not include sensitive database fields", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = regularUserToken;

      const response = await request(app)
        .get("/api/vehicles/search?model=civic")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles[0]).not.toHaveProperty("__v");
      expect(response.body.vehicles[0]).not.toHaveProperty("_id");
    });
  });

  describe("empty search results", () => {
    it("should return message and empty array when no results match", async () => {
      await Vehicle.insertMany(sampleVehicles);
      const token = regularUserToken;

      const response = await request(app)
        .get("/api/vehicles/search?make=nonexistent")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Vehicles retrieved successfully");
      expect(response.body.vehicles).toEqual([]);
      expect(response.body.count).toBe(0);
      expect(response.body.totalCount).toBe(0);
    });
  });

  describe("sorting", () => {
    it("should return search results sorted by creation date (newest first)", async () => {
      const vehicles = await Vehicle.insertMany(sampleVehicles);
      const token = regularUserToken;

      // Get all gasoline vehicles
      const response = await request(app)
        .get("/api/vehicles/search?fuelType=gasoline")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.vehicles.length).toBeGreaterThan(1);

      // Verify they are sorted by createdAt descending
      for (let i = 0; i < response.body.vehicles.length - 1; i++) {
        const current = new Date(response.body.vehicles[i].createdAt);
        const next = new Date(response.body.vehicles[i + 1].createdAt);
        expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
      }
    });
  });
});
