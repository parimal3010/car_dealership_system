const Vehicle = require("../models/Vehicle");

async function addVehicle(vehicleData) {
  const vehicle = await Vehicle.create(vehicleData);
  return vehicle;
}

module.exports = {
  addVehicle,
};
