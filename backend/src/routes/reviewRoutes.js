const express = require("express");

const reviewController = require("../controllers/reviewController");

const {
    authenticateToken
} = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// GET PAPER REVIEWS
// ==========================================

router.get(
    "/papers/:id/reviews",
    reviewController.getPaperReviews
);


// ==========================================
// GET MY REVIEWS (authenticated user)
// ==========================================

router.get(
    "/reviews/me",
    authenticateToken,
    reviewController.getMyReviews
);


// ==========================================
// CREATE REVIEW
// ==========================================

router.post(
    "/papers/:id/reviews",
    authenticateToken,
    reviewController.createReview
);


// ==========================================
// UPDATE REVIEW
// ==========================================

router.put(
    "/reviews/:id",
    authenticateToken,
    reviewController.updateReview
);


module.exports = router;