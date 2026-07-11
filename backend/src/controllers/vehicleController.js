const Vehicle = require("../models/Vehicle");
const { formatVehicleResponse } = require("../utils/formatVehicle");
const {
  validateAddVehicleInput,
  validatePaginationParams,
} = require("../validators/vehicleValidator");
const { addVehicle, getAllVehicles } = require("../services/vehicleService");

const createVehicle = async (req, res) => {
  const { make, model, year, price, mileage, color, fuelType, transmission } =
    req.body;

  // Validate input
  const validationError = validateAddVehicleInput({
    make,
    model,
    year,
    price,
    mileage,
    color,
    fuelType,
    transmission,
  });

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  // Create vehicle using service
  const vehicle = await addVehicle({
    make,
    model,
    year,
    price,
    mileage: mileage || 0,
    color,
    fuelType,
    transmission,
  });

  return res.status(201).json({
    message: "Vehicle added successfully",
    vehicle: formatVehicleResponse(vehicle),
  });
};

const getVehicles = async (req, res) => {
  // Validate and parse pagination parameters
  const { limit, skip } = validatePaginationParams(req.query);

  // Fetch vehicles using service
  const { vehicles, totalCount } = await getAllVehicles(limit, skip);

  // Format vehicles for response
  const formattedVehicles = vehicles.map(formatVehicleResponse);

  return res.status(200).json({
    message: "Vehicles retrieved successfully",
    vehicles: formattedVehicles,
    count: formattedVehicles.length,
    totalCount,
  });
};

module.exports = {
  createVehicle,
  getVehicles,
};
