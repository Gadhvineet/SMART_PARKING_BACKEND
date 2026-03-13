const parkingLot = require('../models/parkingLotModel');

const addParkingLot = async (req,res)=>{
    try{
        const ParkingLot = await parkingLot.create(req.body)
        res.status(201).json({
            message:"Parking lot added successfully",
            parkingLot:ParkingLot
        })
    }                                       
    catch(error){
        res.status(500).json({
            message:"Error while adding parking lot",
            error:error
        })
    }   
}

const getParkingLots = async (req,res)=>{
    try{
        const parkingLots = await parkingLot.find().populate("slots")

        res.status(200).json({      
            message:"Parking lots fetched successfully",
            parkingLots:parkingLots
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while fetching parking lots",
            error:error
        })
    }
}

const getParkingLotById = async (req,res)=>{
    try{
        const parkingLot = await parkingLot.findById(req.params.id).populate("slots")
        res.status(200).json({
            message:"Parking lot fetched successfully",
            parkingLot:parkingLot
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while fetching parking lot",
            error:error
        })
    }
}
const updateParkingLot = async (req,res)=>{
    try{
        const parkingLot = await parkingLot.findByIdAndUpdate(  
            req.params.id,
            req.body,
            {new:true}
        )
        res.status(200).json({
            message:"Parking lot updated successfully",
            parkingLot:parkingLot
        })
    }       
    catch(error){
        res.status(500).json({
            message:"Error while updating parking lot",
            error:error
        })
    }   
}
const deleteParkingLot = async (req,res)=>{
    try{
        await parkingLot.findByIdAndDelete(req.params.id)
        res.status(200).json({
            message:"Parking lot deleted successfully"
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while deleting parking lot",
            error:error
        })
    }
}   

module.exports = { addParkingLot , getParkingLots , getParkingLotById , updateParkingLot , deleteParkingLot }