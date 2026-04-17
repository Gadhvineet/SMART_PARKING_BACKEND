const Payment = require('../models/paymentModel');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require("dotenv").config();

// Lazy initialization — ensures dotenv has loaded before keys are read
let razorpayInstance = null;
const getRazorpayInstance = () => {
    if (!razorpayInstance) {
        const key_id = (process.env.RAZORPAY_KEY_ID || '').trim();
        const key_secret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
        console.log('Initializing Razorpay with key_id:', key_id ? key_id.substring(0, 12) + '...' : 'MISSING');
        razorpayInstance = new Razorpay({ key_id, key_secret });
    }
    return razorpayInstance;
};

const createOrder = async (req, res) => {
    try {
        const { amount, reservation, user, paymentMethod } = req.body;

        if (!amount || !reservation || !user) {
            return res.status(400).json({ message: "amount, reservation, and user are required" });
        }

        const options = {
            amount: Math.round(amount * 100), // amount in paise (smallest currency unit)
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        };

        const order = await getRazorpayInstance().orders.create(options);

        if (!order) return res.status(500).json({ message: "Some error occurred with Razorpay" });

        const payment = await Payment.create({
            reservation,
            user,
            amount,
            paymentMethod: paymentMethod || 'card',
            paymentStatus: 'pending',
            razorpay_order_id: order.id
        });

        res.status(201).json({
            message: "Order created successfully",
            order: order,
            paymentId: payment._id
        });
    } catch (error) {
        console.error('createOrder error:', error);
        res.status(500).json({
            message: "Error while creating order",
            error: error.message || error
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            paymentId
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", (process.env.RAZORPAY_KEY_SECRET || '').trim())
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            const updatedPayment = await Payment.findByIdAndUpdate(
                paymentId,
                {
                    paymentStatus: 'completed',
                    razorpay_payment_id,
                    razorpay_signature,
                    transactionID: razorpay_payment_id
                },
                { new: true }
            );

            return res.status(200).json({
                message: "Payment verified successfully",
                payment: updatedPayment
            });
        } else {
            return res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        console.error('verifyPayment error:', error);
        res.status(500).json({
            message: "Error while verifying payment",
            error: error.message || error
        });
    }
};

const getRazorpayKey = (req, res) => {
    res.status(200).json({ key: (process.env.RAZORPAY_KEY_ID || '').trim() });
};

const createPayment = async (req, res) => {
    try {
        const payment = await Payment.create(req.body)
        res.status(201).json({
            message: "Payment created successfully",
            payment: payment
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Error while creating payment",
            error: error
        })
    }
}

const getPayments = async (req, res) => {
    try {
        const payments = await Payment
            .find()
            .populate("user")
            .populate("reservation")

        res.status(200).json({
            message: "Payments fetched successfully",
            payments: payments
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Error while fetching payments",
            error: error
        })
    }
}

const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment
            .findById(req.params.id)
            .populate("user")
            .populate("reservation")

        res.status(200).json({
            message: "Payment fetched successfully",
            payment: payment
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Error while fetching payment",
            error: error
        })
    }
}

const updatePayment = async (req, res) => {
    try {
        const payment = await
            Payment.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            )
        res.status(200).json({

            message: "Payment updated successfully",
            payment: payment
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Error while updating payment",
            error: error
        })
    }
}
const deletePayment = async (req, res) => {
    try {
        await Payment.findByIdAndDelete(req.params.id)
        res.status(200).json({
            message: "Payment deleted successfully"
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Error while deleting payment",
            error: error
        })
    }
}

module.exports = { createPayment, getPayments, getPaymentById, updatePayment, deletePayment, createOrder, verifyPayment, getRazorpayKey }