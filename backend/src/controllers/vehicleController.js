const { formatVehicleResponse } = require("../utils/formatVehicle");
// const { updateVehicleDetails } = require("../services/vehicleService");
// const { formatVehicleResponse } = require("../utils/vehicleFormatter");

const {
  validateAddVehicleInput,
  validatePaginationParams,
  validateSearchParams,
} = require("../validators/vehicleValidator");

const {
  addVehicle,
  getAllVehicles,
  searchVehicles,
} = require("../services/vehicleService");

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

  // Create vehicle
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
  // Validate pagination parameters
  const { limit, skip } = validatePaginationParams(req.query);

  // Fetch vehicles
  const { vehicles, totalCount } = await getAllVehicles(limit, skip);

  return res.status(200).json({
    message: "Vehicles retrieved successfully",
    vehicles: vehicles.map(formatVehicleResponse),
    count: vehicles.length,
    totalCount,
  });
};

// const searchVehicle = async (req, res) => {
//   // Validate search parameters
//   const { filter, error } = validateSearchParams(req.query);

//   if (error) {
//     return res.status(400).json({ message: error });
//   }

//   // Search vehicles
//   const vehicles = await searchVehicles(filter);

//   return res.status(200).json({
//     message: "Vehicles retrieved successfully",
//     vehicles: vehicles.map(formatVehicleResponse),
//     count: vehicles.length,
//   });
// };
const searchVehicle = async (req, res) => {
  try {
    const { filter, error } = validateSearchParams(req.query);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const vehicles = await searchVehicles(filter);

    const formattedVehicles = vehicles.map(formatVehicleResponse);

    return res.status(200).json({
      message: "Vehicles retrieved successfully",
      vehicles: formattedVehicles,
      count: formattedVehicles.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve vehicles",
      error: error.message,
    });
  }
};


const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await updateVehicleDetails(id, req.body);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle: formatVehicleResponse(vehicle),
    });

  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Failed to update vehicle",
      error: error.message,
    });
  }
};
const updateVehicleDetails = async (id, updateData) => {
  const vehicle = await Vehicle.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  return vehicle;
};

module.exports = {
  createVehicle,
  getVehicles,
  searchVehicle,
    updateVehicleDetails,
     updateVehicle, 
};