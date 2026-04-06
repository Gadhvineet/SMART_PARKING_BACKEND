const express = require("express")
const app = express()
const cors = require('cors'); 
app.use(cors());

const dotenv = require("dotenv")
dotenv.config()

const DBConnection = require("./src/utils/DBConnection")
DBConnection()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static('uploads'))

const userRoutes = require("./src/routes/userRoutes")
const vehicleRoutes = require("./src/routes/vehicleRoutes")
const parkingLotRoutes = require("./src/routes/parkingLotRoutes")
const parkingSlotRoutes = require("./src/routes/parkingSlotRoutes")
const reservationRoutes = require("./src/routes/reservationRoutes")
const paymentRoutes = require("./src/routes/paymentRoutes")
const reviewRoutes = require("./src/routes/reviewRoutes")

app.use('/api/users', userRoutes)
app.use("/vehicles", vehicleRoutes)
app.use("/parkinglots", parkingLotRoutes)
app.use("/slots", parkingSlotRoutes)
app.use("/reservations", reservationRoutes)
app.use("/payments", paymentRoutes)
app.use("/reviews", reviewRoutes)

app.get("/", (req,res)=>{
    res.send("Smart Parking API Running")
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));