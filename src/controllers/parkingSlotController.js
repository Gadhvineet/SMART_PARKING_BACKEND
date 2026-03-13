const parkingSlot = require('../models/parkingSlotModel');

const addParkingSlot = async (req,res)=>{
    try{
        const ParkingSlot = await parkingSlot.create(req.body)
        res.status(201).json({
            message:"Parking slot added successfully",
            parkingSlot:ParkingSlot
        })
    }                                       
    catch(error){
        res.status(500).json({
            message:"Error while adding parking slot",
            error:error
        })
    }   
}

const getParkingSlots = async (req,res)=>{
    try{
        const parkingSlots = await parkingSlot.find().populate("parkingLot")
        res.status(200).json({
            message:"Parking slots fetched successfully",
            parkingSlots:parkingSlots
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while fetching parking slots",
            error:error
        })
    }
}

const getParkingSlotById = async (req,res)=>{
    try{
        const parkingSlot = await parkingSlot.findById(req.params.id).populate("parkingLot")    
        res.status(200).json({
            message:"Parking slot fetched successfully",
            parkingSlot:parkingSlot
        })
    }   
    catch(error){   
        res.status(500).json({
            message:"Error while fetching parking slot",
            error:error
        })
    }   
}
 
const updateParkingSlot = async (req,res)=>{ 
    try{    
        const parkingSlot = await parkingSlot.findByIdAndUpdate(
            req.params.id,
            req.body,   
            {new:true}
        )
        res.status(200).json({
            message:"Parking slot updated successfully",        
            parkingSlot:parkingSlot
        })
    }   
    catch(error){
        res.status(500).json({
            message:"Error while updating parking slot",        
            error:error
        })
    }
}

const deleteParkingSlot = async (req,res)=>{
    try{
        await parkingSlot.findByIdAndDelete(req.params.id)  
        res.status(200).json({
            message:"Parking slot deleted successfully"
        })
    }   
    catch(error){
        res.status(500).json({
            message:"Error while deleting parking slot",    
            error:error
        })  
    }
}  

module.exports = { addParkingSlot , getParkingSlots , getParkingSlotById , updateParkingSlot , deleteParkingSlot }
