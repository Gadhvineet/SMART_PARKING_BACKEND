const express = require("express");
const router = express.Router();

const parkingLotController = require('../controllers/parkingLotController');
const authMiddleware = require('../middleware/authMiddleware');

router.post("/create", authMiddleware(["owner"]), parkingLotController.addParkingLot);

router.get("/get", authMiddleware(["owner", "user"]), parkingLotController.getParkingLots);
router.get(
  "/all",
  authMiddleware(["user"]),
  parkingLotController.getAllParkingLots
);

router.get("/get/:id", authMiddleware(), parkingLotController.getParkingLotById);
router.put("/update/:id", authMiddleware(["owner"]), parkingLotController.updateParkingLot);
router.delete("/delete/:id", authMiddleware(["owner"]), parkingLotController.deleteParkingLot);

module.exports = router;