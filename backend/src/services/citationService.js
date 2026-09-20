const pool = require("../config/db");

const getPaperCitations = async (paperId) => {
    const query = `
        SELECT
            p.paper_id,
            p.title,
            p.publication_year,
            p.paper_type,
            ra.area_name,
            pv.name AS venue_name
        FROM citations c
        INNER JOIN papers p
            ON c.cited_paper_id = p.paper_id
        INNER JOIN research_areas ra
            ON p.area_id = ra.area_id
        LEFT JOIN publication_venues pv
            ON p.venue_id = pv.venue_id
        WHERE c.citing_paper_id = $1
        ORDER BY p.publication_year DESC, p.title;
    `;

    const result = await pool.query(query, [paperId]);

    return result.rows;
};

const getPaperCitedBy = async (paperId) => {
    const query = `
        SELECT
            p.paper_id,
            p.title,
            p.publication_year,
            p.paper_type,
            ra.area_name,
            pv.name AS venue_name
        FROM citations c
        INNER JOIN papers p
            ON c.citing_paper_id = p.paper_id
        INNER JOIN research_areas ra
            ON p.area_id = ra.area_id
        LEFT JOIN publication_venues pv
            ON p.venue_id = pv.venue_id
        WHERE c.cited_paper_id = $1
        ORDER BY p.publication_year DESC, p.title;
    `;

    const result = await pool.query(query, [paperId]);

    return result.rows;
};

const getCitationStats = async (paperId) => {
    const query = `
        SELECT
            $1::INTEGER AS paper_id,
            (
                SELECT COUNT(*)
                FROM citations
                WHERE citing_paper_id = $1
            ) AS citations_count,
            (
                SELECT COUNT(*)
                FROM citations
                WHERE cited_paper_id = $1
            ) AS cited_by_count;
    `;

    const result = await pool.query(query, [paperId]);

    return result.rows[0];
};

module.exports = {
    getPaperCitations,
    getPaperCitedBy,
    getCitationStats
};