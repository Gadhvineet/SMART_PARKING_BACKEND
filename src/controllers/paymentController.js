const Payment  = require('../models/paymentModel');

const createPayment = async (req,res)=>{
    try{
        const payment = await Payment.create(req.body)  
        res.status(201).json({
            message:"Payment created successfully",
            payment:payment
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while creating payment",
            error:error
        })
    }   
}

const getPayments = async (req,res)=>{
    try{
        const payments = await Payment
        .find()
        .populate("user")
        .populate("reservation")

        res.status(200).json({
            message:"Payments fetched successfully",
            payments:payments
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while fetching payments",
            error:error
        })
    }
}

const getPaymentById = async (req,res)=>{
    try{
        const payment = await Payment
        .findById(req.params.id)
        .populate("user")
        .populate("reservation")

        res.status(200).json({
            message:"Payment fetched successfully",
            payment:payment
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while fetching payment",
            error:error
        })
    }
}
   
const updatePayment = async (req,res)=>{
    try{
        const payment = await   
        Payment.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        res.status(200).json({

            message:"Payment updated successfully",
            payment:payment
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while updating payment",
            error:error
        })
    }       
}
const deletePayment = async (req,res)=>{
    try{
        await Payment.findByIdAndDelete(req.params.id)
        res.status(200).json({
            message:"Payment deleted successfully"
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while deleting payment",
            error:error
        })
    }
}

module.exports = { createPayment , getPayments , getPaymentById , updatePayment , deletePayment }