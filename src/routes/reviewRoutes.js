const express = require("express");
const router = express.Router();

const reviewController = require('../controllers/reviewController');
const authMiddleware = require("../middleware/authMiddleware");


// USER ADD REVIEW
router.post(
"/create",
authMiddleware(["user"]),
reviewController.addReview
);



// GET REVIEWS BY PARKING LOT
router.get(
"/lot/:lotId",
reviewController.getReviewsByLot
);


// OWNER VIEW REVIEWS
router.get(
"/owner",
authMiddleware(["owner"]),
reviewController.getOwnerReviews
);


// CHECK IF USER REVIEWED A RESERVATION
router.get(
"/check/:reservationId",
authMiddleware(["user"]),
reviewController.checkReviewExists
);

module.exports = router;