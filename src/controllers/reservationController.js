const Reservation = require("../models/reservationModel");
const ParkingSlot = require("../models/parkingSlotModel");
const ParkingLot = require("../models/parkingLotModel");
const Notification = require("../models/notificationModel");


// CREATE RESERVATION
const createReservation = async (req, res) => {

  try {

    const { slot, parkingLot } = req.body;

    const slotDoc = await ParkingSlot.findById(slot);

    if (!slotDoc) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slotDoc.status !== "available") {
      return res.status(400).json({ message: "Slot is not available" });
    }

    const reservation = await Reservation.create({
      ...req.body,
      user: req.user.id
    });

    // UPDATE SLOT STATUS
    slotDoc.status = "reserved";
    await slotDoc.save();

    // UPDATE AVAILABLE SLOTS
    await ParkingLot.findByIdAndUpdate(
      parkingLot,
      { $inc: { availableSlots: -1 } }
    );

    // CREATE NOTIFICATION
    await Notification.create({
      user: req.user.id,
      title: "Booking Confirmed! 🅿️",
      message: `Your reservation at ${slotDoc.slotNumber} has been confirmed successfully.`,
      type: "success"
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



// OWNER GET RESERVATIONS
const getOwnerReservations = async (req, res) => {

  try {

    const reservations = await Reservation
      .find()
      .populate("user")
      .populate("vehicle")
      .populate({
        path: "parkingLot",
        match: { owner: req.user.id }
      })
      .populate("slot")
      .sort({ createdAt: -1 });

    const ownerReservations = reservations.filter(
      r => r.parkingLot !== null
    );

    res.status(200).json({
      message: "Owner reservations fetched successfully",
      reservations: ownerReservations
    });

  } catch (error) {

    res.status(500).json({
      message: "Error fetching owner reservations",
      error: error.message
    });

  }

};

// OWNER ACTIVE BOOKINGS COUNT
const getOwnerActiveBookings = async (req, res) => {

  try {

    const reservations = await Reservation
      .find({ status: "active" })
      .populate({
        path: "parkingLot",
        match: { owner: req.user.id }
      });

    const ownerReservations = reservations.filter(
      r => r.parkingLot !== null
    );

    res.status(200).json({
      count: ownerReservations.length
    });

  } catch (error) {

    res.status(500).json({
      message: "Error fetching active bookings",
      error: error.message
    });

  }

};



// EXTEND PARKING
const extendReservation = async (req, res) => {

  try {

    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    const currentEndTime = new Date(reservation.timePeriod.endTime);

    const newEndTime = new Date(
      currentEndTime.getTime() + 60 * 60 * 1000
    );

    reservation.timePeriod.endTime = newEndTime;

    await reservation.save();

    // CREATE NOTIFICATION
    await Notification.create({
      user: req.user.id, // Ensure user exists on req.user (may need to verify if extend route has auth context, but it should)
      title: "Parking Extended ⏳",
      message: "Your parking has been extended by 1 hour successfully.",
      type: "info"
    });

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



// UPDATE RESERVATION
const updateReservation = async (req, res) => {

  try {

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // IF CANCELLED → FREE SLOT
    if (req.body.status === "cancelled") {

      const slot = await ParkingSlot.findById(reservation.slot);

      if (slot) {
        slot.status = "available";
        await slot.save();
      }

      await ParkingLot.findByIdAndUpdate(
        reservation.parkingLot,
        { $inc: { availableSlots: 1 } }
      );

      // CREATE NOTIFICATION (CANCELLED)
      if (reservation.user) {
        await Notification.create({
          user: reservation.user,
          title: "Reservation Cancelled ❌",
          message: "Your reservation has been cancelled successfully.",
          type: "warning"
        });
      }

    }


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



// DELETE RESERVATION
const deleteReservation = async (req, res) => {

  try {

    const reservation = await Reservation.findById(req.params.id);

    if (reservation) {

      const slot = await ParkingSlot.findById(reservation.slot);

      if (slot) {
        slot.status = "available";
        await slot.save();
      }

      await ParkingLot.findByIdAndUpdate(
        reservation.parkingLot,
        { $inc: { availableSlots: 1 } }
      );

      // CREATE NOTIFICATION (DELETED/CANCELLED)
      if (reservation.user) {
        await Notification.create({
          user: reservation.user,
          title: "Reservation Removed ❌",
          message: "Your reservation has been completely removed.",
          type: "warning"
        });
      }

    }

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
  getOwnerReservations,
  getOwnerActiveBookings,
  extendReservation,
  updateReservation,
  deleteReservation
};