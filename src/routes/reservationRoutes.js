const express = require("express");
const router = express.Router();

const reservationController = require("../controllers/reservationController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", authMiddleware(["user"]), reservationController.createReservation);

router.get("/get", authMiddleware(["admin"]), reservationController.getReservations);

router.get("/user", authMiddleware(["user"]), reservationController.getUserReservations);

router.put("/extend/:id", authMiddleware(["user"]), reservationController.extendReservation);

router.put("/update/:id", authMiddleware(), reservationController.updateReservation);

router.delete("/delete/:id", authMiddleware(), reservationController.deleteReservation);

module.exports = router;