const pool = require("../config/db");


// ==========================================
// SYSTEM STATISTICS
// ==========================================

const getStats = async () => {
    const result = await pool.query(`
        SELECT
            (SELECT COUNT(*) FROM users)     AS total_users,
            (SELECT COUNT(*) FROM papers)    AS total_papers,
            (SELECT COUNT(*) FROM authors)   AS total_authors,
            (SELECT COUNT(*) FROM citations) AS total_citations,
            (SELECT COUNT(*) FROM downloads) AS total_downloads,
            (SELECT COUNT(*) FROM bookmarks) AS total_bookmarks,
            (SELECT COUNT(*) FROM reviews)   AS total_reviews,
            (SELECT COALESCE(ROUND(AVG(rating), 2), 0)
                FROM reviews)                AS average_rating;
    `);

    const roles = await pool.query(`
        SELECT role, COUNT(*) AS user_count
        FROM users
        GROUP BY role
        ORDER BY role;
    `);

    return { ...result.rows[0], users_by_role: roles.rows };
};


// ==========================================
// USERS (password_hash is never selected)
// ==========================================

const getUsers = async () => {
    const result = await pool.query(`
        SELECT
            u.user_id,
            u.name,
            u.email,
            u.role,
            u.created_at,
            (SELECT COUNT(*) FROM reviews r
                WHERE r.user_id = u.user_id)   AS review_count,
            (SELECT COUNT(*) FROM bookmarks b
                WHERE b.user_id = u.user_id)   AS bookmark_count,
            (SELECT COUNT(*) FROM papers p
                WHERE p.uploaded_by = u.user_id) AS paper_count
        FROM users u
        ORDER BY u.user_id;
    `);

    return result.rows;
};


// ==========================================
// AUDIT LOG (written by the log_paper_changes trigger)
// ==========================================

const getAuditLogs = async (limit) => {
    const result = await pool.query(
        `
        SELECT
            audit_id,
            user_id,
            paper_id,
            action,
            old_value,
            new_value,
            "timestamp" AS logged_at
        FROM audit_log
        ORDER BY "timestamp" DESC, audit_id DESC
        LIMIT $1;
        `,
        [limit]
    );

    return result.rows;
};


module.exports = {
    getStats,
    getUsers,
    getAuditLogs
};
