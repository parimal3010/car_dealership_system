const { formatVehicleResponse } = require("../utils/formatVehicle");

const {
  validateAddVehicleInput,
  validatePaginationParams,
} = require("../validators/vehicleValidator");

const {
  addVehicle,
  getAllVehicles,
  searchVehicles,
  deleteVehicleById,
  purchaseVehicleById,
  updateVehicleDetails,
  restockVehicleById,
} = require("../services/vehicleService");


const createVehicle = async (req, res) => {
  const {
    make,
    model,
    year,
    price,
    category,
    mileage,
    color,
    fuelType,
    transmission,
    quantity,
  } = req.body;

  const validationError = validateAddVehicleInput({
    make,
    model,
    year,
    price,
    category,
    mileage,
    color,
    fuelType,
    transmission,
    quantity,
  });

  if (validationError) {
    return res.status(400).json({
      message: validationError,
    });
  }

  const vehicle = await addVehicle({
    make,
    model,
    year,
    price,
    category,
    mileage: mileage || 0,
    color,
    fuelType,
    transmission,
    quantity,
  });

  return res.status(201).json({
    message: "Vehicle added successfully",
    vehicle: formatVehicleResponse(vehicle),
  });
};



const getVehicles = async (req, res) => {
  const { limit, skip } = validatePaginationParams(req.query);

  const { vehicles, totalCount } = await getAllVehicles(limit, skip);

  return res.status(200).json({
    message: "Vehicles retrieved successfully",
    vehicles: vehicles.map(formatVehicleResponse),
    count: vehicles.length,
    totalCount,
  });
};



// Search vehicles by make, model, category, price range
const searchVehicle = async (req, res) => {
  try {
    const {
      make,
      model,
      category,
      minPrice,
      maxPrice,
    } = req.query;


    const filter = {};


    if (make) {
      filter.make = {
        $regex: make,
        $options: "i",
      };
    }


    if (model) {
      filter.model = {
        $regex: model,
        $options: "i",
      };
    }


    if (category) {
      filter.category = {
        $regex: category,
        $options: "i",
      };
    }


    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
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
      message: "Failed to search vehicles",
      error: error.message,
    });

  }
};




const updateVehicle = async (req, res) => {
  try {

    const { id } = req.params;


    const vehicle = await updateVehicleDetails(
      id,
      req.body
    );


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





const deleteVehicle = async (req, res) => {
  try {

    const vehicle = await deleteVehicleById(
      req.params.id
    );


    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }


    return res.status(200).json({
      message: "Vehicle deleted successfully",
    });


  } catch (error) {


    const statusCode =
      error.name === "CastError"
        ? 400
        : 500;


    return res.status(statusCode).json({
      message:
        statusCode === 400
          ? "Invalid vehicle id"
          : "Failed to delete vehicle",
    });

  }
};






const purchaseVehicle = async (req, res) => {
  try {

    const vehicle = await purchaseVehicleById(
      req.params.id,
      req.body.quantity
    );


    return res.status(200).json({
      message: "Vehicle purchased successfully",
      remainingQuantity: vehicle.quantity,
    });


  } catch (error) {


    const errorResponses = {
      "Invalid purchase quantity": 400,
      "Insufficient quantity": 400,
      "Vehicle not found": 404,
    };


    return res.status(
      errorResponses[error.message] || 500
    ).json({

      message:
        errorResponses[error.message]
          ? error.message === "Insufficient quantity"
            ? "Insufficient vehicle quantity"
            : error.message
          : "Failed to purchase vehicle",

    });

  }
};






const restockVehicle = async (req, res) => {
  try {

    const vehicle = await restockVehicleById(
      req.params.id,
      req.body.quantity
    );


    return res.status(200).json({
      message: "Vehicle restocked successfully",
      quantity: vehicle.quantity,
    });


  } catch (error) {


    const statusCodes = {
      "Invalid restock quantity": 400,
      "Vehicle not found": 404,
    };


    return res.status(
      statusCodes[error.message] || 500
    ).json({

      message:
        error.message ||
        "Failed to restock vehicle",

    });

  }
};





module.exports = {
  createVehicle,
  getVehicles,
  searchVehicle,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
};