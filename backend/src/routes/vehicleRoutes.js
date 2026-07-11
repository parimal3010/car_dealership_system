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
const {
  deleteVehicle,
} = require("../controllers/vehicleController");
router.delete("/:id", deleteVehicle);

const {
  updateVehicle,
} = require("../controllers/vehicleController");

router.put("/:id", updateVehicle);

const {
  purchaseVehicle,
} = require("../controllers/vehicleController");
router.post("/:id/purchase", purchaseVehicle);
module.exports = router;