const express = require ("express")
const router = express.Router()
const parkingLotController = require('../controllers/parkingLotController');

router.post("/create", parkingLotController.addParkingLot);
router.get("/get", parkingLotController.getParkingLots);
router.get("/get/:id", parkingLotController.getParkingLotById);
router.put("/update/:id", parkingLotController.updateParkingLot);
router.delete("/delete/:id", parkingLotController.deleteParkingLot);

module.exports = router;