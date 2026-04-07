const User = require("../models/userModel");
const ParkingLot = require("../models/parkingLotModel");
const Slot = require("../models/parkingSlotModel");
const Reservation = require("../models/reservationModel");


// ==============================
// ADMIN DASHBOARD STATS
// ==============================

const getDashboardStats = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments({ role: "user" });
    const totalOwners = await User.countDocuments({ role: "owner" });
    const totalParkingLots = await ParkingLot.countDocuments();
    const totalBookings = await Reservation.countDocuments();

    res.status(200).json({
      totalUsers,
      totalOwners,
      totalParkingLots,
      totalBookings
    });

  } catch (error) {

    res.status(500).json({
      message: "Error fetching dashboard stats",
      error: error.message
    });

  }
};


// ==============================
// GET ALL USERS
// ==============================

const getAllUsers = async (req, res) => {
  try {

    const users = await User.find({ role: "user" }).select("-password");

    res.status(200).json({
      message: "Users fetched successfully",
      users
    });

  } catch (error) {

    res.status(500).json({
      message: "Error fetching users",
      error: error.message
    });

  }
};


// ==============================
// GET ALL OWNERS
// ==============================

const getAllOwners = async (req, res) => {
  try {

    const owners = await User.find({ role: "owner" }).select("-password");

    res.status(200).json({
      message: "Owners fetched successfully",
      owners
    });

  } catch (error) {

    res.status(500).json({
      message: "Error fetching owners",
      error: error.message
    });

  }
};


// ==============================
// DELETE USER / OWNER
// ==============================

const deleteUser = async (req, res) => {
  try {

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "User deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Error deleting user",
      error: error.message
    });

  }
};


// ==============================
// GET ALL PARKING LOTS
// ==============================

const getAllParkingLots = async (req, res) => {
  try {

    const lots = await ParkingLot.find().populate("owner", "name email");

    res.status(200).json({
      message: "Parking lots fetched successfully",
      lots
    });

  } catch (error) {

    res.status(500).json({
      message: "Error fetching parking lots",
      error: error.message
    });

  }
};


// ==============================
// DELETE PARKING LOT
// ==============================

const deleteParkingLot = async (req, res) => {
  try {

    await ParkingLot.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Parking lot deleted"
    });

  } catch (error) {

    res.status(500).json({
      message: "Error deleting parking lot",
      error: error.message
    });

  }
};


// ==============================
// GET ALL SLOTS
// ==============================

const getAllSlots = async (req, res) => {
  try {

    const slots = await Slot.find().populate("parkingLot");

    res.status(200).json({
      message: "Slots fetched successfully",
      slots
    });

  } catch (error) {

    res.status(500).json({
      message: "Error fetching slots",
      error: error.message
    });

  }
};


// ==============================
// GET ALL BOOKINGS
// ==============================

const getAllBookings = async (req, res) => {
  try {

    const bookings = await Reservation.find()
      .populate("user", "name email")
      .populate("slot")
      .populate("parkingLot");

    res.status(200).json({
      message: "Bookings fetched successfully",
      bookings
    });

  } catch (error) {

    res.status(500).json({
      message: "Error fetching bookings",
      error: error.message
    });

  }
};


module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllOwners,
  deleteUser,
  getAllParkingLots,
  deleteParkingLot,
  getAllSlots,
  getAllBookings
};