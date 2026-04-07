const Vehicle = require('../models/vehicleModel');
const { validationResult } = require("express-validator");

const addVehicle = async (req, res) => {
  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array()
      });
    }

    let { vehicleName, vehicleType, vehicleNumber, colour } = req.body;

    vehicleNumber = vehicleNumber.toUpperCase().trim();

    let imageUrl = "";

    if (req.file) {
      imageUrl = `uploads/${req.file.filename}`;
    }

    const newVehicle = new Vehicle({
      user: req.user.id,
      vehicleName,
      vehicleType,
      vehicleNumber,
      colour,
      image: imageUrl
    });

    await newVehicle.save();

    res.status(201).json({
      message: "Vehicle added successfully",
      vehicle: newVehicle
    });

  } catch (error) {
    res.status(500).json({
      message: "Error while adding vehicle",
      error: error.message
    });
  }
};

const getVehicles = async (req, res) => {
  try {

    const vehicles = await Vehicle.find({ user: req.user.id });

    res.status(200).json({
      message: "Vehicles fetched successfully",
      vehicles
    });

  } catch (error) {
    res.status(500).json({
      message: "Error while fetching vehicles",
      error: error.message
    });
  }
};

const getVehicleById = async (req, res) => {
  try {

    const vehicle = await Vehicle.findById(req.params.id);

    res.status(200).json({
      message: "Vehicle fetched successfully",
      vehicle
    });

  } catch (error) {
    res.status(500).json({
      message: "Error while fetching vehicle",
      error: error.message
    });
  }
};

const updateVehicle = async (req, res) => {
  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array()
      });
    }

    let updateData = { ...req.body };

    if (updateData.vehicleNumber) {
      updateData.vehicleNumber = updateData.vehicleNumber.toUpperCase().trim();
    }

    if (req.file) {
      updateData.image = req.file.path || req.file.secure_url;
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle: updatedVehicle
    });

  } catch (error) {
    res.status(500).json({
      message: "Error while updating vehicle",
      error: error.message
    });
  }
};

const deleteVehicle = async (req, res) => {
  try {

    await Vehicle.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Vehicle deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error while deleting vehicle",
      error: error.message
    });
  }
};

module.exports = {
  addVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
};