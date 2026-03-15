const router = require('express').Router()
const reservationController = require('../controllers/reservationController')
router.post("/create",reservationController.createReservation)
router.get("/get",reservationController.getReservations)
router.get("/get/:id",reservationController.getReservationById)
router.put("/update/:id",reservationController.updateReservation)
router.delete("/delete/:id",reservationController.deleteReservation)

module.exports = router