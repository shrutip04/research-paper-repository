const express = require("express");

const reviewController = require("../controllers/reviewController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Anyone can view reviews
router.get(
    "/papers/:id/reviews",
    reviewController.getPaperReviews
);

// Login required to create a review
router.post(
    "/papers/:id/reviews",
    authenticateToken,
    reviewController.createReview
);

// Login required to update a review
router.put(
    "/reviews/:id",
    authenticateToken,
    reviewController.updateReview
);

module.exports = router;