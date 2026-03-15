const router = require('express').Router()
const vehicleController = require('../controllers/vehicleController')

router.post("/create",vehicleController.createVehicle)
router.get("/get",vehicleController.getVehicles)
router.get("/get/:id",vehicleController.getVehicleById)
router.put("/update/:id",vehicleController.updateVehicle)
router.delete("/delete/:id",vehicleController.deleteVehicle)

module.exports = router