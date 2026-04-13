const ParkingSlot = require("../models/parkingSlotModel");
const Reservation = require("../models/reservationModel");


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


// CREATE MULTIPLE SLOTS
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


// AUTO GENERATE SLOTS
const generateSlots = async (req,res)=>{

    try{

        const { parkingLot , prefix , totalSlots } = req.body

        const slotDocs = []

        for(let i=1;i<=totalSlots;i++){

            slotDocs.push({
                parkingLot: parkingLot,
                slotNumber: `${prefix}${i}`
            })

        }

        const createdSlots = await ParkingSlot.insertMany(slotDocs)

        res.status(201).json({
            message:"Slots generated successfully",
            slots:createdSlots
        })

    }
    catch(error){

        res.status(500).json({
            message:"Error generating slots",
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


// GET SLOTS BY PARKING LOT WITH LIVE STATUS
const getSlotsByLot = async (req,res)=>{

    try{

        const slots = await ParkingSlot.find({
            parkingLot:req.params.lotId
        })

        const now = new Date()

        const updatedSlots = await Promise.all(

            slots.map(async (slot)=>{

                const reservation = await Reservation.findOne({
                    slot:slot._id,
                    status:"active"
                })

                if(!reservation){

                    slot.status="available"
                    return slot

                }

                const start = new Date(reservation.timePeriod.startTime)
                const end = new Date(reservation.timePeriod.endTime)

                if(now < start){

                    slot.status="reserved"

                }
                else if(now >= start && now <= end){

                    slot.status="occupied"

                }
                else{

                    slot.status="available"

                }

                return slot

            })

        )

        res.status(200).json({
            message:"Slots fetched successfully",
            slots:updatedSlots
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
    generateSlots,
    getParkingSlots,
    getSlotsByLot,
    deleteParkingSlot
}