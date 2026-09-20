const pool = require("../config/db");

const getPaperReviews = async (paperId) => {
    const query = `
        SELECT
            r.review_id,
            r.paper_id,
            r.user_id,
            u.name AS reviewer_name,
            r.rating,
            r.review_text,
            r.created_at,
            r.updated_at
        FROM reviews r
        INNER JOIN users u
            ON r.user_id = u.user_id
        WHERE r.paper_id = $1
        ORDER BY r.created_at DESC;
    `;

    const result = await pool.query(query, [paperId]);

    return result.rows;
};

const getPaperRatingSummary = async (paperId) => {
    const query = `
        SELECT
            COUNT(*) AS review_count,
            COALESCE(ROUND(AVG(rating), 2), 0) AS average_rating
        FROM reviews
        WHERE paper_id = $1;
    `;

    const result = await pool.query(query, [paperId]);

    return result.rows[0];
};

const createReview = async (paperId, reviewData) => {
    const {
        user_id,
        rating,
        review_text
    } = reviewData;

    const query = `
        INSERT INTO reviews (
            paper_id,
            user_id,
            rating,
            review_text
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
            review_id,
            paper_id,
            user_id,
            rating,
            review_text,
            created_at,
            updated_at;
    `;

    const result = await pool.query(query, [
        paperId,
        user_id,
        rating,
        review_text || null
    ]);

    return result.rows[0];
};

const updateReview = async (reviewId, userId, reviewData) => {
    const {
        rating,
        review_text
    } = reviewData;

    const query = `
        UPDATE reviews
        SET
            rating = $1,
            review_text = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE review_id = $3
          AND user_id = $4
        RETURNING
            review_id,
            paper_id,
            user_id,
            rating,
            review_text,
            created_at,
            updated_at;
    `;

    const result = await pool.query(query, [
        rating,
        review_text || null,
        reviewId,
        userId
    ]);

    return result.rows[0] || null;
};

module.exports = {
    getPaperReviews,
    getPaperRatingSummary,
    createReview,
    updateReview
};