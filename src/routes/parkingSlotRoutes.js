const express = require("express")
const router = express.Router()

const parkingSlotController = require("../controllers/parkingSlotController")

router.post("/create", parkingSlotController.addParkingSlot)

router.post("/generate", parkingSlotController.generateSlots)

// CREATE MULTIPLE SLOTS
router.post("/create-multiple", parkingSlotController.createMultipleSlots)

// GET ALL SLOTS
router.get("/get", parkingSlotController.getParkingSlots)

// GET SLOTS BY PARKING LOT
router.get("/lot/:lotId", parkingSlotController.getSlotsByLot)

// DELETE SLOT
router.delete("/delete/:id", parkingSlotController.deleteParkingSlot)

module.exports = router