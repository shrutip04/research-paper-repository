const pool = require("../config/db");

const getAllAreas = async () => {
    const query = `
        SELECT
            area_id,
            area_name,
            description
        FROM research_areas
        ORDER BY area_name;
    `;

    const result = await pool.query(query);
    return result.rows;
};

const getAreaPapers = async (areaId) => {
    const query = `
        SELECT
            p.paper_id,
            p.title,
            p.abstract,
            p.publication_year,
            p.paper_type,
            p.doi,
            p.file_url,
            ra.area_name,
            pv.name AS venue_name
        FROM papers p
        INNER JOIN research_areas ra
            ON p.area_id = ra.area_id
        LEFT JOIN publication_venues pv
            ON p.venue_id = pv.venue_id
        WHERE p.area_id = $1
        ORDER BY p.publication_year DESC, p.title;
    `;

    const result = await pool.query(query, [areaId]);
    return result.rows;
};

module.exports = {
    getAllAreas,
    getAreaPapers
};