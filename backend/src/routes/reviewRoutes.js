const express = require("express");
const reviewController = require("../controllers/reviewController");

const router = express.Router();

router.get("/papers/:id/reviews", reviewController.getPaperReviews);
router.post("/papers/:id/reviews", reviewController.createReview);
router.put("/reviews/:id", reviewController.updateReview);

module.exports = router;