const Vehicle = require("../models/Vehicle");
const { formatVehicleResponse } = require("../utils/formatVehicle");

const createVehicle = async (req, res) => {
  const { make, model, year, price, mileage, color, fuelType, transmission } =
    req.body;

  // Validation
  if (!make) {
    return res.status(400).json({ message: "Make is required" });
  }

  if (!model) {
    return res.status(400).json({ message: "Model is required" });
  }

  if (!year) {
    return res.status(400).json({ message: "Year is required" });
  }

  if (typeof year !== "number" || !Number.isInteger(year)) {
    return res.status(400).json({ message: "Year must be a valid number" });
  }

  const currentYear = new Date().getFullYear();
  if (year > currentYear) {
    return res.status(400).json({ message: "Year cannot be in the future" });
  }

  if (price === undefined || price === null) {
    return res.status(400).json({ message: "Price is required" });
  }

  if (typeof price !== "number" || price < 0) {
    return res
      .status(400)
      .json({ message: "Price must be a non-negative number" });
  }

  // Create vehicle
  const vehicle = await Vehicle.create({
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

module.exports = {
  createVehicle,
};
