const Reservation = require("../models/reservationModel");
const ParkingSlot = require("../models/parkingSlotModel");
const ParkingLot = require("../models/parkingLotModel");
const Notification = require("../models/notificationModel");

/**
 * AUTO-COMPLETE EXPIRED RESERVATIONS
 * 
 * Finds all reservations where:
 *   - status is "active"
 *   - endTime has already passed
 * 
 * For each expired reservation:
 *   1. Sets reservation status to "completed"
 *   2. Sets the slot status back to "available"
 *   3. Increments parkingLot.availableSlots by 1
 *   4. Creates a notification for the user
 */
const autoCompleteExpiredReservations = async () => {
  try {
    const now = new Date();

    // Find all active reservations whose endTime has passed
    const expiredReservations = await Reservation.find({
      status: "active",
      "timePeriod.endTime": { $lt: now }
    });

    if (expiredReservations.length === 0) return;

    console.log(`⏰ Auto-completing ${expiredReservations.length} expired reservation(s)...`);

    for (const reservation of expiredReservations) {
      try {
        // 1. Mark reservation as completed
        reservation.status = "completed";
        await reservation.save();

        // 2. Free the slot
        const slot = await ParkingSlot.findById(reservation.slot);
        if (slot && slot.status !== "available") {
          slot.status = "available";
          await slot.save();
        }

        // 3. Increment available slots on the parking lot
        await ParkingLot.findByIdAndUpdate(
          reservation.parkingLot,
          { $inc: { availableSlots: 1 } }
        );

        // 4. Notify the user
        await Notification.create({
          user: reservation.user,
          title: "Parking Session Ended ✅",
          message: "Your parking session has ended and the slot has been released automatically.",
          type: "info"
        });

      } catch (innerError) {
        // Log but don't crash — continue processing other reservations
        console.error(`❌ Error auto-completing reservation ${reservation._id}:`, innerError.message);
      }
    }

    console.log(`✅ Auto-completed ${expiredReservations.length} reservation(s) successfully.`);

  } catch (error) {
    console.error("❌ Error in autoCompleteExpiredReservations:", error.message);
  }
};

module.exports = autoCompleteExpiredReservations;
