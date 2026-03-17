const Review    = require('../models/reviewModel');

const addReview = async (req,res)=>{
    try{
        const newReview = await Review.create(req.body) 
        res.status(201).json({
            message:"Review added",
            review:newReview
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while adding review",
            error:error
        })
    }   
}

const getReviews = async (req,res)=>{
    try{
        const reviews = await Review
        .find()
        .populate("user")
        .populate("parkingLot")

        res.status(200).json({
            message:"Reviews fetched successfully",
            reviews:reviews
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while fetching reviews",
            error:error
        })
    }
}

const getReviewById = async (req,res)=>{
    try{
        const review = await Review
        .findById(req.params.id)
        .populate("user")
        .populate("parkingLot")

        res.status(200).json({
            message:"Review fetched successfully",
            review:review
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while fetching review",
            error:error
        })
    }
}

const updateReview = async (req,res)=>{
    try{
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )

        res.status(200).json({
            message:"Review updated successfully",
            review:review
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while updating review",
            error:error
        })
    }
}

const deleteReview = async (req,res)=>{
    try{
        await Review.findByIdAndDelete(req.params.id)

        res.status(200).json({
            message:"Review deleted successfully"
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while deleting review",
            error:error
        })
    }
}

module.exports = { addReview , getReviews , getReviewById , updateReview , deleteReview }





