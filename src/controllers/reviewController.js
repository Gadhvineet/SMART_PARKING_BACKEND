const Review = require('../models/reviewModel');
const Reservation = require("../models/reservationModel");


// ADD REVIEW
const addReview = async (req,res)=>{
    try{

        const { parkingLot, reservation, rating, comment } = req.body;

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


module.exports = {
    addReview,
    getReviewsByLot,
    getOwnerReviews
};