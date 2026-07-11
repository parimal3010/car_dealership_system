const request = require("supertest");
const app = require("../app");
const Vehicle = require("../models/vehicleModel");

describe("PUT /api/vehicles/:id", () => {
  let vehicle;

  beforeEach(async () => {
    vehicle = await Vehicle.create({
      make: "Toyota",
      model: "Camry",
      year: 2020,
      price: 25000,
      mileage: 30000,
      color: "White",
      fuelType: "Petrol",
      category: "Sedan",
    });
  });

  afterEach(async () => {
    await Vehicle.deleteMany();
  });

  test("should update vehicle details successfully", async () => {
    const response = await request(app)
      .put(`/api/vehicles/${vehicle._id}`)
      .send({
        price: 22000,
        color: "Black",
        mileage: 25000,
      });

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty(
      "message",
      "Vehicle updated successfully"
    );

    expect(response.body.vehicle).toMatchObject({
      id: vehicle._id.toString(),
      make: "Toyota",
      model: "Camry",
      price: 22000,
      color: "Black",
      mileage: 25000,
    });
  });


  test("should return 404 if vehicle does not exist", async () => {
    const fakeId = "64b7f9a12345678901234567";

    const response = await request(app)
      .put(`/api/vehicles/${fakeId}`)
      .send({
        price: 20000,
      });

    expect(response.statusCode).toBe(404);

    expect(response.body).toEqual({
      message: "Vehicle not found",
    });
  });


  test("should return 400 for invalid update data", async () => {
    const response = await request(app)
      .put(`/api/vehicles/${vehicle._id}`)
      .send({
        price: -5000,
      });

    expect(response.statusCode).toBe(400);

    expect(response.body).toHaveProperty(
      "message"
    );
  });


  test("should update only provided fields", async () => {
    const response = await request(app)
      .put(`/api/vehicles/${vehicle._id}`)
      .send({
        color: "Blue",
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.vehicle).toMatchObject({
      make: "Toyota",
      model: "Camry",
      color: "Blue",
      price: 25000,
      mileage: 30000,
    });
  });
});