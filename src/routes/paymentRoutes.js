const express = require("express")
const router = express.Router()
const paymentController = require('../controllers/paymentController')

router.get("/razorpay-key", paymentController.getRazorpayKey)

router.post("/create-order", paymentController.createOrder)
router.post("/verify", paymentController.verifyPayment)

router.post("/create",paymentController.createPayment)
router.get("/get",paymentController.getPayments)
router.get("/get/:id",paymentController.getPaymentById)
router.put("/update/:id",paymentController.updatePayment)
router.delete("/delete/:id",paymentController.deletePayment)

module.exports = router