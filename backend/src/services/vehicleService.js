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
const deleteVehicleById = async (id) => {
  const vehicle = await Vehicle.findByIdAndDelete(id);

  return vehicle;
};


const purchaseVehicleById = async (id, quantity) => {
  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    return null;
  }

  if (vehicle.quantity < quantity) {
    throw new Error("Insufficient quantity");
  }

  vehicle.quantity -= quantity;

  await vehicle.save();

  return vehicle;
};


const restockVehicleById = async (id, quantity) => {
  if (!quantity || quantity <= 0) {
    throw new Error("Invalid restock quantity");
  }

  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  vehicle.quantity += quantity;

  return vehicle.save();
};
module.exports = {
  addVehicle,
  getAllVehicles,
   searchVehicles,
   deleteVehicleById,
   purchaseVehicleById,
   restockVehicleById,
};
