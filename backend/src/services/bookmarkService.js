const pool = require("../config/db");

const getUserBookmarks = async (userId) => {
    const query = `
        SELECT
            b.bookmark_id,
            b.user_id,
            b.paper_id,
            b.created_at,

            p.title,
            p.abstract,
            p.publication_year,
            p.paper_type,
            p.doi,

            ra.area_name,
            pv.name AS venue_name

        FROM bookmarks b

        INNER JOIN papers p
            ON b.paper_id = p.paper_id

        INNER JOIN research_areas ra
            ON p.area_id = ra.area_id

        LEFT JOIN publication_venues pv
            ON p.venue_id = pv.venue_id

        WHERE b.user_id = $1

        ORDER BY b.created_at DESC;
    `;

    const result = await pool.query(query, [userId]);

    return result.rows;
};

const createBookmark = async (userId, paperId) => {
    const query = `
        INSERT INTO bookmarks (
            user_id,
            paper_id
        )
        VALUES ($1, $2)
        RETURNING
            bookmark_id,
            user_id,
            paper_id,
            created_at;
    `;

    const result = await pool.query(query, [
        userId,
        paperId
    ]);

    return result.rows[0];
};

const deleteBookmark = async (userId, paperId) => {
    const query = `
        DELETE FROM bookmarks
        WHERE user_id = $1
          AND paper_id = $2
        RETURNING
            bookmark_id,
            user_id,
            paper_id;
    `;

    const result = await pool.query(query, [
        userId,
        paperId
    ]);

    return result.rows[0] || null;
};

module.exports = {
    getUserBookmarks,
    createBookmark,
    deleteBookmark
};