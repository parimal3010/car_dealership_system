const Vehicle = require("../models/Vehicle");

async function addVehicle(vehicleData) {
  const vehicle = await Vehicle.create(vehicleData);
  return vehicle;
}

async function getAllVehicles(limit, skip) {
  const vehicles = await Vehicle.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  const totalCount = await Vehicle.countDocuments();

  return {
    vehicles,
    totalCount,
  };
}
// const Vehicle = require("../models/Vehicle");

const searchVehicles = async (filter) => {
  return Vehicle.find(filter).sort({ createdAt: -1 });
};
module.exports = {
  addVehicle,
  getAllVehicles,
   searchVehicles,
};
