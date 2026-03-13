const vehicle = require('../models/vehicleModel');

const addVehicle = async (req,res)=>{
    try{
        const newVehicle = await vehicle.create(req.body)
        res.status(201).json({
            message:"Vehicle added successfully",
            vehicle:newVehicle
        })
    }   
    catch(error){
        res.status(500).json({
            message:"Error while adding vehicle",
            error:error
        })
    }
}
const getVehicles = async (req,res)=>{
    try{
        const vehicles = await Vehicle.find().populate("user")

        res.status(200).json({
            message:"Vehicles fetched successfully",
            vehicles:vehicles
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while fetching vehicles",
            error:error
        })
    }
}

const  getVehicleById = async (req,res)=>{
    try{
        const vehicle = await vehicle.findById(req.params.id)   
        res.status(200).json({
            message:"Vehicle fetched successfully",
            vehicle:vehicle
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while fetching vehicle",
            error:error
        })
    }
}
const updateVehicle = async (req,res)=>{
    try{
        const vehicle = await vehicle.findByIdAndUpdate(
            req.params.id,
            req.body,   
            {new:true}
        )
        res.status(200).json({
            message:"Vehicle updated successfully",
            vehicle:vehicle
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while updating vehicle",
            error:error
        })
    }
}
const deleteVehicle = async (req,res)=>{
    try{
        await vehicle.findByIdAndDelete(req.params.id)  
        res.status(200).json({
            message:"Vehicle deleted successfully"
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while deleting vehicle",
            error:error
        })
    }
}

module.exports = { addVehicle , getVehicles , getVehicleById , updateVehicle , deleteVehicle}