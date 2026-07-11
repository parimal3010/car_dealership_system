const express = require("express");
const {
  createVehicle,
  getVehicles,
  searchVehicle,
} = require("../controllers/vehicleController");
const asyncHandler = require("../middleware/asyncHandler");
const {
  authenticateToken,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/vehicles - Create vehicle (admin only)
router.post(
  "/",
  authenticateToken,
  authorizeAdmin,
  asyncHandler(createVehicle)
);

// GET /api/vehicles/search - Search vehicles
router.get(
  "/search",
  authenticateToken,
  asyncHandler(searchVehicle)
);

// GET /api/vehicles - Get all vehicles (authenticated users)
router.get(
  "/",
  authenticateToken,
  asyncHandler(getVehicles)
);

module.exports = router;