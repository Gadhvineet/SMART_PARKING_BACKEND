const express = require("express");
const router = express.Router();

const vehicleController = require("../controllers/vehicleController");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

// CREATE VEHICLE
router.post(
  "/create",
  authMiddleware(), // 👈 VERY IMPORTANT
  upload.single("image"),
  vehicleController.addVehicle
);

// GET USER VEHICLES
router.get(
  "/get",
  authMiddleware(), // 👈 IMPORTANT
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
  vehicleController.updateVehicle
);

// DELETE VEHICLE
router.delete(
  "/delete/:id",
  authMiddleware(),
  vehicleController.deleteVehicle
);

module.exports = router;