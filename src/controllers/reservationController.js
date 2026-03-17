const Reservation = require("../models/reservationModel")

const createReservation = async (req,res)=>{
    try{
        const reservation = await Reservation.create(req.body)

        res.status(201).json({
            message:"Reservation created successfully",
            reservation:reservation
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while creating reservation",
            error:error
        })
    }
}

const getReservations = async (req,res)=>{
    try{
        const reservations = await Reservation
        .find()
        .populate("user")
        .populate("vehicle")
        .populate("parkingLot")
        .populate("slot")

        res.status(200).json({
            message:"Reservations fetched successfully",
            reservations:reservations
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while fetching reservations",
            error:error
        })
    }
}

const getReservationById = async (req,res)=>{
    try{
        const reservation = await Reservation
        .findById(req.params.id)
        .populate("user")
        .populate("vehicle")
        .populate("parkingLot")
        .populate("slot")

        res.status(200).json({
            message:"Reservation fetched successfully",
            reservation:reservation
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while fetching reservation",
            error:error
        })
    }
}

const updateReservation = async (req,res)=>{
    try{
        const reservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )

        res.status(200).json({
            message:"Reservation updated successfully",
            reservation:reservation
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while updating reservation",
            error:error
        })
    }
}
const deleteReservation = async (req,res)=>{
    try{
        await Reservation.findByIdAndDelete(req.params.id)

        res.status(200).json({
            message:"Reservation deleted successfully"
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while deleting reservation",
            error:error
        })
    }
}

module.exports = { createReservation , getReservations , getReservationById , updateReservation , deleteReservation }
