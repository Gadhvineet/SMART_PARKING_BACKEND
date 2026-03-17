const express = require("express")
const router = express.Router()
const parkingSlotController = require('../controllers/parkingSlotController')

router.post("/create",parkingSlotController.addParkingSlot)
router.get("/get",parkingSlotController.getParkingSlots)
router.get("/get/:id",parkingSlotController.getParkingSlotById)
router.put("/update/:id",parkingSlotController.updateParkingSlot)
router.delete("/delete/:id",parkingSlotController.deleteParkingSlot)    

module.exports = router