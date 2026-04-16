const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const adminAuth = require("../middleware/adminMiddleware");


// DASHBOARD
router.get("/dashboard", adminAuth, adminController.getDashboardStats);


// USERS
router.get("/users", adminAuth, adminController.getAllUsers);
router.patch("/users/:id/status", adminAuth, adminController.updateUserStatus);
router.delete("/users/:id", adminAuth, adminController.deleteUser);


// OWNERS
router.get("/owners", adminAuth, adminController.getAllOwners);


// PARKING LOTS
router.get("/parkinglots", adminAuth, adminController.getAllParkingLots);
router.delete("/parkinglots/:id", adminAuth, adminController.deleteParkingLot);


// SLOTS
router.get("/slots", adminAuth, adminController.getAllSlots);


// BOOKINGS
router.get("/bookings", adminAuth, adminController.getAllBookings);
router.patch("/bookings/:id/cancel", adminAuth, adminController.cancelBooking);
router.post("/bookings/:id/report", adminAuth, adminController.reportBookingOwner);


module.exports = router;