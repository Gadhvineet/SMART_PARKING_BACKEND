const ParkingLot = require('../models/parkingLotModel');


// ADD PARKING LOT (OWNER)
const addParkingLot = async (req, res) => {
  try {
    const newParking = await ParkingLot.create({
      ...req.body,
      owner: req.user.id
    });

    res.status(201).json({
      message: "Parking lot added successfully",
      parkingLot: newParking
    });

  } catch (error) {
    res.status(500).json({
      message: "Error while adding parking lot",
      error: error.message
    });
  }
};


// OWNER GETS HIS PARKING LOTS
const getParkingLots = async (req, res) => {
  try {

    const parkingLots = await ParkingLot.find({
      owner: req.user.id
    });

    res.status(200).json({
      message: "Parking lots fetched successfully",
      parkingLots
    });

  } catch (error) {
    res.status(500).json({
      message: "Error while fetching parking lots",
      error: error.message
    });
  }
};


// 🔥 USER GETS ALL PARKING LOTS (IMPORTANT FOR FIND PARKING PAGE)
const getAllParkingLots = async (req, res) => {
  try {

    const parkingLots = await ParkingLot.find();

    res.status(200).json({
      message: "All parking lots fetched successfully",
      parkingLots
    });

  } catch (error) {
    res.status(500).json({
      message: "Error while fetching all parking lots",
      error: error.message
    });
  }
};


// GET SINGLE PARKING LOT
const getParkingLotById = async (req, res) => {
  try {

    const parkingLot = await ParkingLot.findById(req.params.id);

    res.status(200).json({
      message: "Parking lot fetched successfully",
      parkingLot: parkingLot
    });

  } catch (error) {
    res.status(500).json({
      message: "Error while fetching parking lot",
      error: error.message
    });
  }
};


// UPDATE PARKING LOT
const updateParkingLot = async (req, res) => {
  try {

    const parkingLot = await ParkingLot.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "Parking lot updated successfully",
      parkingLot: parkingLot
    });

  } catch (error) {
    res.status(500).json({
      message: "Error while updating parking lot",
      error: error.message
    });
  }
};


// DELETE PARKING LOT
const deleteParkingLot = async (req, res) => {
  try {

    await ParkingLot.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Parking lot deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error while deleting parking lot",
      error: error.message
    });
  }
};


module.exports = {
  addParkingLot,
  getParkingLots,
  getAllParkingLots, // 🔥 NEW FUNCTION
  getParkingLotById,
  updateParkingLot,
  deleteParkingLot
};