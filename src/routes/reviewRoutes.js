const express = require("express")
const router = express.Router()
const reviewController = require('../controllers/reviewController');
router.post("/create", reviewController.addReview);
router.get("/get", reviewController.getReviews);
router.get("/get/:id", reviewController.getReviewById);
router.put("/update/:id", reviewController.updateReview);
router.delete("/delete/:id", reviewController.deleteReview);
module.exports = router;