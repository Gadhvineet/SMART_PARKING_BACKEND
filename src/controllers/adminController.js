const User = require("../models/userModel");
const ParkingLot = require("../models/parkingLotModel");
const Slot = require("../models/parkingSlotModel");
const Reservation = require("../models/reservationModel");
const Payment = require("../models/paymentModel");
const Review = require("../models/reviewModel");
const Notification = require("../models/notificationModel");


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

    const lotsWithAnalytics = await Promise.all(lots.map(async (lot) => {
      // Get all reservations for this lot
      const reservations = await Reservation.find({ parkingLot: lot._id })
        .populate("user", "name email")
        .populate("vehicle", "plateNumber type");
        
      const reservationIds = reservations.map(r => r._id);

      // Get completed payments for these reservations
      const payments = await Payment.find({ reservation: { $in: reservationIds }, paymentStatus: 'completed' });
      const totalRevenue = payments.reduce((acc, pay) => acc + pay.amount, 0);

      // Get reviews for this lot
      const reviews = await Review.find({ parkingLot: lot._id }).populate("user", "name");
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0 ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews).toFixed(1) : "N/A";

      // Get slots for this lot
      const slots = await Slot.find({ parkingLot: lot._id });

      return {
        ...lot.toObject(),
        totalRevenue,
        averageRating,
        totalReviews,
        reservations,
        reviews,
        slots
      };
    }));

    res.status(200).json({
      message: "Parking lots fetched successfully",
      lots: lotsWithAnalytics
    });

  } catch (error) {

    res.status(500).json({
      message: "Error fetching parking lots",
      error: error.message
    });

  }
};


// ==============================
// DELETE PARKING LOT (CASCADE)
// ==============================

const deleteParkingLot = async (req, res) => {
  try {
    const lotId = req.params.id;

    // 1. Find all reservations for this lot
    const reservations = await Reservation.find({ parkingLot: lotId });
    const reservationIds = reservations.map(r => r._id);

    // 2. Delete all payments linked to those reservations
    if (reservationIds.length > 0) {
      await Payment.deleteMany({ reservation: { $in: reservationIds } });
    }

    // 3. Delete all reservations for this lot
    await Reservation.deleteMany({ parkingLot: lotId });

    // 4. Delete all slots for this lot
    await Slot.deleteMany({ parkingLot: lotId });

    // 5. Delete all reviews for this lot
    await Review.deleteMany({ parkingLot: lotId });

    // 6. Delete the parking lot itself
    await ParkingLot.findByIdAndDelete(lotId);

    res.status(200).json({
      message: "Parking lot and all associated data deleted successfully"
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
      .populate("vehicle", "plateNumber type")
      .populate("slot")
      .populate({ path: "parkingLot", populate: { path: "owner" } })
      .sort({ createdAt: -1 });

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


// ==============================
// CANCEL BOOKING (+ FREE SLOT)
// ==============================

const cancelBooking = async (req, res) => {
  try {
    const booking = await Reservation.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only process if booking wasn't already cancelled/completed
    if (booking.status === "active") {

      // Free the slot
      const slot = await Slot.findById(booking.slot);
      if (slot) {
        slot.status = "available";
        await slot.save();
      }

      // Increment available slots on the parking lot
      await ParkingLot.findByIdAndUpdate(
        booking.parkingLot,
        { $inc: { availableSlots: 1 } }
      );

      // Notify the user
      await Notification.create({
        user: booking.user,
        title: "Booking Cancelled by Admin ❌",
        message: "Your reservation has been cancelled by the administrator. The slot has been released.",
        type: "warning"
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling booking", error: error.message });
  }
};


// ==============================
// REPORT BOOKING TO OWNER
// ==============================

const reportBookingOwner = async (req, res) => {
  try {
    const { message } = req.body;
    const booking = await Reservation.findById(req.params.id).populate("parkingLot");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const ownerId = booking.parkingLot.owner;

    const notification = new Notification({
      user: ownerId,
      title: "Admin Report Regarding Booking",
      message: message || `Admin has raised a flag regarding booking ID: ${booking._id}`,
      type: "warning",
      reservation: booking._id
    });

    await notification.save();

    res.status(200).json({ message: "Owner notified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error notifying owner", error: error.message });
  }
};


// ==============================
// UPDATE USER STATUS (BLOCK/ACTIVE)
// ==============================

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `User status updated to ${status}`,
      user
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating status",
      error: error.message
    });
  }
};


module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllOwners,
  updateUserStatus,
  deleteUser,
  getAllParkingLots,
  deleteParkingLot,
  getAllSlots,
  getAllBookings,
  cancelBooking,
  reportBookingOwner
};