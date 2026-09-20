const pool = require("../config/db");

const recordDownload = async (userId, paperId) => {
    const query = `
        INSERT INTO downloads (
            user_id,
            paper_id
        )
        VALUES ($1, $2)
        RETURNING
            download_id,
            user_id,
            paper_id,
            downloaded_at;
    `;

    const result = await pool.query(query, [
        userId,
        paperId
    ]);

    return result.rows[0];
};

const getPaperDownloads = async (paperId) => {
    const query = `
        SELECT
            d.download_id,
            d.user_id,
            u.name AS user_name,
            d.downloaded_at
        FROM downloads d
        INNER JOIN users u
            ON d.user_id = u.user_id
        WHERE d.paper_id = $1
        ORDER BY d.downloaded_at DESC;
    `;

    const result = await pool.query(query, [paperId]);

    return result.rows;
};

const getPaperDownloadCount = async (paperId) => {
    const query = `
        SELECT
            COUNT(*) AS download_count
        FROM downloads
        WHERE paper_id = $1;
    `;

    const result = await pool.query(query, [paperId]);

    return result.rows[0];
};

module.exports = {
    recordDownload,
    getPaperDownloads,
    getPaperDownloadCount
};