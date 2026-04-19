const Review = require('../models/reviewModel');
const Reservation = require("../models/reservationModel");


// ADD REVIEW
const addReview = async (req,res)=>{
    try{

        const { parkingLot, reservation, rating, comment } = req.body;

        // 1. Verify the reservation exists and belongs to the user
        const reservationDoc = await Reservation.findById(reservation);
        if (!reservationDoc) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        if (reservationDoc.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only review your own reservations" });
        }

        // 2. Ensure parking time is completed (endTime must be in the past)
        const now = new Date();
        if (new Date(reservationDoc.timePeriod.endTime) > now) {
            return res.status(400).json({ message: "You can only review after your parking session has ended" });
        }

        // 3. Prevent cancelled bookings from being reviewed
        if (reservationDoc.status === "cancelled") {
            return res.status(400).json({ message: "Cancelled reservations cannot be reviewed" });
        }

        // 4. Check for duplicate review (one review per reservation per user)
        const existingReview = await Review.findOne({ user: req.user.id, reservation });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this reservation" });
        }

        const newReview = await Review.create({
            user: req.user.id,
            parkingLot,
            reservation,
            rating,
            comment
        });

        res.status(201).json({
            message:"Review added",
            review:newReview
        })

    }
    catch(error){
        res.status(500).json({
            message:"Error while adding review",
            error:error.message
        })
    }
}

// GET REVIEWS FOR A PARKING LOT
const getReviewsByLot = async (req,res)=>{

    try{

        const reviews = await Review
        .find({parkingLot:req.params.lotId})
        .populate("user","name")
        .sort({createdAt:-1});

        res.status(200).json({
            reviews
        });

    }
    catch(error){

        res.status(500).json({
            message:"Error fetching reviews",
            error:error.message
        });

    }

};


// OWNER GET REVIEWS OF THEIR LOTS
const getOwnerReviews = async (req,res)=>{

    try{

        const reviews = await Review
        .find()
        .populate("user","name")
        .populate({
            path:"parkingLot",
            match:{owner:req.user.id}
        });

        const ownerReviews = reviews.filter(r => r.parkingLot !== null);

        res.status(200).json({
            reviews:ownerReviews
        });

    }
    catch(error){

        res.status(500).json({
            message:"Error fetching owner reviews",
            error:error.message
        });

    }

};


// CHECK IF USER ALREADY REVIEWED A RESERVATION
const checkReviewExists = async (req, res) => {
    try {
        const existing = await Review.findOne({
            user: req.user.id,
            reservation: req.params.reservationId
        });

        res.status(200).json({
            hasReview: !!existing
        });

    } catch (error) {
        res.status(500).json({
            message: "Error checking review",
            error: error.message
        });
    }
};


module.exports = {
    addReview,
    getReviewsByLot,
    getOwnerReviews,
    checkReviewExists
};