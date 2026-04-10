const Reservation = require("../models/reservationModel");


// CREATE RESERVATION
const createReservation = async (req, res) => {

  try {

    const reservation = await Reservation.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json({
      message: "Reservation created successfully",
      reservation
    });

  } catch (error) {

    res.status(500).json({
      message: "Error while creating reservation",
      error: error.message
    });

  }

};



// ADMIN GET ALL
const getReservations = async (req, res) => {

  try {

    const reservations = await Reservation
      .find()
      .populate("user")
      .populate("vehicle")
      .populate("parkingLot")
      .populate("slot");

    res.status(200).json({
      message: "Reservations fetched successfully",
      reservations
    });

  } catch (error) {

    res.status(500).json({
      message: "Error while fetching reservations",
      error: error.message
    });

  }

};



// USER RESERVATIONS
const getUserReservations = async (req, res) => {

  try {

    const reservations = await Reservation
      .find({ user: req.user.id })
      .populate("vehicle")
      .populate("parkingLot")
      .populate("slot")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "User reservations fetched successfully",
      reservations
    });

  } catch (error) {

    res.status(500).json({
      message: "Error fetching reservations",
      error: error.message
    });

  }

};



// EXTEND PARKING TIME
const extendReservation = async (req, res) => {

  try {

    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    const currentEndTime = new Date(reservation.timePeriod.endTime);

    const newEndTime = new Date(currentEndTime.getTime() + 60 * 60 * 1000); // +1 hour

    reservation.timePeriod.endTime = newEndTime;

    await reservation.save();

    res.status(200).json({
      message: "Parking time extended by 1 hour",
      reservation
    });

  } catch (error) {

    res.status(500).json({
      message: "Error extending reservation",
      error: error.message
    });

  }

};



// UPDATE
const updateReservation = async (req, res) => {

  try {

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "Reservation updated successfully",
      reservation
    });

  } catch (error) {

    res.status(500).json({
      message: "Error while updating reservation",
      error: error.message
    });

  }

};



// DELETE
const deleteReservation = async (req, res) => {

  try {

    await Reservation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Reservation deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Error while deleting reservation",
      error: error.message
    });

  }

};


module.exports = {
  createReservation,
  getReservations,
  getUserReservations,
  extendReservation,
  updateReservation,
  deleteReservation
};