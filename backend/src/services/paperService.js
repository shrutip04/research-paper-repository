const pool = require("../config/db");

const getAllPapers = async () => {
    const query = `
        SELECT
            p.paper_id,
            p.title,
            p.abstract,
            p.publication_year,
            p.doi,
            p.paper_type,
            p.file_url,
            p.area_id,
            ra.area_name,
            p.venue_id,
            pv.name AS venue_name,
            p.uploaded_by,
            p.created_at
        FROM papers p
        INNER JOIN research_areas ra
            ON p.area_id = ra.area_id
        LEFT JOIN publication_venues pv
            ON p.venue_id = pv.venue_id
        ORDER BY p.publication_year DESC, p.paper_id;
    `;

    const result = await pool.query(query);

    return result.rows;
};

const getPaperById = async (paperId) => {
    const query = `
        SELECT
            p.paper_id,
            p.title,
            p.abstract,
            p.publication_year,
            p.doi,
            p.paper_type,
            p.file_url,
            p.area_id,
            ra.area_name,
            p.venue_id,
            pv.name AS venue_name,
            pv.venue_type,
            pv.publisher,
            pv.issn,
            p.uploaded_by,
            p.created_at
        FROM papers p
        INNER JOIN research_areas ra
            ON p.area_id = ra.area_id
        LEFT JOIN publication_venues pv
            ON p.venue_id = pv.venue_id
        WHERE p.paper_id = $1;
    `;

    const result = await pool.query(query, [paperId]);

    return result.rows[0] || null;
};


module.exports = {
    getAllPapers,
    getPaperById
};