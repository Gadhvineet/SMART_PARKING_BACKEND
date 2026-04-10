const ParkingSlot = require("../models/parkingSlotModel");


// CREATE SINGLE SLOT
const addParkingSlot = async (req,res)=>{
    try{

        const slot = await ParkingSlot.create(req.body)

        res.status(201).json({
            message:"Parking slot added successfully",
            slot
        })

    }
    catch(error){

        res.status(500).json({
            message:"Error while adding parking slot",
            error:error.message
        })

    }
}


// CREATE MULTIPLE SLOTS (IMPORTANT)
const createMultipleSlots = async (req,res)=>{

    try{

        const { parkingLot , slots } = req.body

        const slotDocs = slots.map(slotNumber => ({
            parkingLot: parkingLot,
            slotNumber: slotNumber
        }))

        const createdSlots = await ParkingSlot.insertMany(slotDocs)

        res.status(201).json({
            message:"Slots created successfully",
            slots:createdSlots
        })

    }
    catch(error){

        res.status(500).json({
            message:"Error creating slots",
            error:error.message
        })

    }

}


// GET ALL SLOTS
const getParkingSlots = async (req,res)=>{
    try{

        const slots = await ParkingSlot.find().populate("parkingLot")

        res.status(200).json({
            message:"Parking slots fetched successfully",
            slots
        })

    }
    catch(error){

        res.status(500).json({
            message:"Error while fetching slots",
            error:error.message
        })

    }
}


// GET SLOTS BY PARKING LOT (VERY IMPORTANT)
const getSlotsByLot = async (req,res)=>{

    try{

        const slots = await ParkingSlot.find({
            parkingLot:req.params.lotId
        })

        res.status(200).json({
            message:"Slots fetched successfully",
            slots
        })

    }
    catch(error){

        res.status(500).json({
            message:"Error fetching slots",
            error:error.message
        })

    }

}


// DELETE SLOT
const deleteParkingSlot = async (req,res)=>{

    try{

        await ParkingSlot.findByIdAndDelete(req.params.id)

        res.status(200).json({
            message:"Slot deleted successfully"
        })

    }
    catch(error){

        res.status(500).json({
            message:"Error deleting slot",
            error:error.message
        })

    }

}


module.exports = {
    addParkingSlot,
    createMultipleSlots,
    getParkingSlots,
    getSlotsByLot,
    deleteParkingSlot
}