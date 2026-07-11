const express = require("express");
const { createVehicle } = require("../controllers/vehicleController");
const asyncHandler = require("../middleware/asyncHandler");
const {
  authenticateToken,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  authorizeAdmin,
  asyncHandler(createVehicle),
);

module.exports = router;
