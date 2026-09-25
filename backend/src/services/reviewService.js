const pool = require("../config/db");


// ==========================================
// GET PAPER REVIEWS
// ==========================================

const getPaperReviews = async (paperId) => {
    const query = `
        SELECT
            r.review_id,
            r.paper_id,
            r.user_id,
            u.name AS reviewer_name,
            r.rating,
            r.comment,
            r.created_at
        FROM reviews r
        INNER JOIN users u
            ON r.user_id = u.user_id
        WHERE r.paper_id = $1
        ORDER BY r.created_at DESC;
    `;

    const result =
        await pool.query(query, [paperId]);

    return result.rows;
};


// ==========================================
// GET RATING SUMMARY
// ==========================================

const getPaperRatingSummary = async (paperId) => {
    const query = `
        SELECT
            COUNT(*) AS review_count,
            COALESCE(
                ROUND(AVG(rating), 2),
                0
            ) AS average_rating
        FROM reviews
        WHERE paper_id = $1;
    `;

    const result =
        await pool.query(query, [paperId]);

    return result.rows[0];
};


// ==========================================
// CREATE REVIEW
// ==========================================

const createReview = async (
    paperId,
    reviewData
) => {
    const {
        user_id,
        rating,
        comment
    } = reviewData;

    const query = `
        INSERT INTO reviews (
            paper_id,
            user_id,
            rating,
            comment
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
            review_id,
            paper_id,
            user_id,
            rating,
            comment,
            created_at;
    `;

    const result =
        await pool.query(
            query,
            [
                paperId,
                user_id,
                rating,
                comment || null
            ]
        );

    return result.rows[0];
};


// ==========================================
// UPDATE REVIEW
// ==========================================

const updateReview = async (
    reviewId,
    userId,
    reviewData
) => {
    const {
        rating,
        comment
    } = reviewData;

    const query = `
        UPDATE reviews
        SET
            rating = $1,
            comment = $2
        WHERE review_id = $3
            AND user_id = $4
        RETURNING
            review_id,
            paper_id,
            user_id,
            rating,
            comment,
            created_at;
    `;

    const result =
        await pool.query(
            query,
            [
                rating,
                comment || null,
                reviewId,
                userId
            ]
        );

    return result.rows[0] || null;
};


// ==========================================
// GET REVIEWS WRITTEN BY ONE USER
// ==========================================

const getUserReviews = async (userId) => {
    const result = await pool.query(
        `
        SELECT
            r.review_id,
            r.paper_id,
            p.title AS paper_title,
            r.rating,
            r.comment,
            r.created_at
        FROM reviews r
        INNER JOIN papers p
            ON r.paper_id = p.paper_id
        WHERE r.user_id = $1
        ORDER BY r.created_at DESC;
        `,
        [userId]
    );

    return result.rows;
};


module.exports = {
    getUserReviews,
    getPaperReviews,
    getPaperRatingSummary,
    createReview,
    updateReview
};