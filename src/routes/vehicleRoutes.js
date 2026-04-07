const express = require("express");
const router = express.Router();

const vehicleController = require("../controllers/vehicleController");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

const { body } = require("express-validator");

// VEHICLE VALIDATION
const vehicleValidation = [
  body("vehicleName")
    .trim()
    .notEmpty()
    .withMessage("Vehicle name is required"),

  body("vehicleType")
    .isIn(["2-wheeler", "3-wheeler", "4-wheeler", "heavy-vehicle"])
    .withMessage("Vehicle type must be 2-wheeler, 3-wheeler, 4-wheeler or heavy-vehicle"),

  body("vehicleNumber")
    .trim()
    .toUpperCase()
    .matches(/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/)
    .withMessage("Vehicle number must be valid (Example: GJ09JE8898)"),

  body("colour")
    .optional()
    .trim()
];


// CREATE VEHICLE
router.post(
  "/create",
  authMiddleware(),
  upload.single("image"),
  vehicleValidation,
  vehicleController.addVehicle
);

// GET USER VEHICLES
router.get(
  "/get",
  authMiddleware(),
  vehicleController.getVehicles
);

// GET SINGLE VEHICLE
router.get(
  "/get/:id",
  authMiddleware(),
  vehicleController.getVehicleById
);

// UPDATE VEHICLE
router.put(
  "/update/:id",
  authMiddleware(),
  upload.single("image"),
  vehicleValidation,
  vehicleController.updateVehicle
);

// DELETE VEHICLE
router.delete(
  "/delete/:id",
  authMiddleware(),
  vehicleController.deleteVehicle
);

module.exports = router;