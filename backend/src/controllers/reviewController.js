const reviewService = require("../services/reviewService");


const getPaperReviews = async (req, res) => {
    try {
        const paperId = Number(req.params.id);

        if (!Number.isInteger(paperId) || paperId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid paper ID"
            });
        }

        const reviews = await reviewService.getPaperReviews(paperId);

        const summary =
            await reviewService.getPaperRatingSummary(paperId);

        res.status(200).json({
            success: true,
            paperId,
            summary,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch paper reviews"
        });
    }
};


const createReview = async (req, res) => {
    try {
        const paperId = Number(req.params.id);

        // Get authenticated user from JWT
        const userId = req.user.user_id;

        const {
            rating,
            review_text
        } = req.body;

        if (!Number.isInteger(paperId) || paperId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid paper ID"
            });
        }

        if (
            !Number.isInteger(Number(rating)) ||
            Number(rating) < 1 ||
            Number(rating) > 5
        ) {
            return res.status(400).json({
                success: false,
                message: "Rating must be an integer between 1 and 5"
            });
        }

        const review = await reviewService.createReview(
            paperId,
            {
                user_id: userId,
                rating: Number(rating),
                review_text
            }
        );

        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review
        });
    } catch (error) {
        console.error("Error creating review:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "User has already reviewed this paper"
            });
        }

        if (error.code === "23503") {
            return res.status(400).json({
                success: false,
                message: "Invalid paper or user"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create review"
        });
    }
};


const updateReview = async (req, res) => {
    try {
        const reviewId = Number(req.params.id);

        // Get authenticated user from JWT
        const userId = req.user.user_id;

        const {
            rating,
            review_text
        } = req.body;

        if (!Number.isInteger(reviewId) || reviewId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid review ID"
            });
        }

        if (
            !Number.isInteger(Number(rating)) ||
            Number(rating) < 1 ||
            Number(rating) > 5
        ) {
            return res.status(400).json({
                success: false,
                message: "Rating must be an integer between 1 and 5"
            });
        }

        const review = await reviewService.updateReview(
            reviewId,
            userId,
            {
                rating: Number(rating),
                review_text
            }
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found or you do not own this review"
            });
        }

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: review
        });
    } catch (error) {
        console.error("Error updating review:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update review"
        });
    }
};


module.exports = {
    getPaperReviews,
    createReview,
    updateReview
};