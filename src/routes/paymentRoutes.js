const express = require("express")
const router = express.Router()
const paymentController = require('../controllers/paymentController')

router.post("/create",paymentController.createPayment)
router.get("/get",paymentController.getPayments)
router.get("/get/:id",paymentController.getPaymentById)
router.put("/update/:id",paymentController.updatePayment)
router.delete("/delete/:id",paymentController.deletePayment)

module.exports = router