const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

/* ================= CORS ================= */

app.use(cors());

/* ================= DATABASE ================= */

const DBConnection = require("./src/utils/DBConnection");
DBConnection();

/* ================= MIDDLEWARE ================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= STATIC FOLDER ================= */

app.use("/uploads", express.static("uploads"));

/* ================= ROUTES ================= */

const userRoutes = require("./src/routes/userRoutes");
const vehicleRoutes = require("./src/routes/vehicleRoutes");
const parkingLotRoutes = require("./src/routes/parkingLotRoutes");
const parkingSlotRoutes = require("./src/routes/parkingSlotRoutes");
const reservationRoutes = require("./src/routes/reservationRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

/* ================= API ROUTES ================= */

app.use("/api/users", userRoutes);      // login / register
app.use("/vehicles", vehicleRoutes);   // vehicle CRUD
app.use("/parkinglots", parkingLotRoutes); // parking lot
app.use("/slots", parkingSlotRoutes);  // parking slots
app.use("/reservations", reservationRoutes); // bookings
app.use("/payments", paymentRoutes);   // payment
app.use("/reviews", reviewRoutes);     // reviews
app.use("/admin", adminRoutes);        // admin panel

/* ================= TEST ROUTE ================= */

app.get("/", (req, res) => {
  res.send("Smart Parking API Running");
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});