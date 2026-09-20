const pool = require("../config/db");

const getAllPapers = async (filters = {}) => {
    let query = `
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
    `;

    const conditions = [];
    const values = [];

    if (filters.area !== undefined) {
        values.push(filters.area);
        conditions.push(`p.area_id = $${values.length}`);
    }

    if (filters.year !== undefined) {
        values.push(filters.year);
        conditions.push(`p.publication_year = $${values.length}`);
    }

    if (filters.paper_type !== undefined) {
        values.push(filters.paper_type);
        conditions.push(`p.paper_type = $${values.length}`);
    }

    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += `
        ORDER BY p.publication_year DESC, p.paper_id;
    `;

    const result = await pool.query(query, values);

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

const searchPapers = async (searchTerm) => {
    const query = `
        SELECT *
        FROM search_papers($1);
    `;

    const result = await pool.query(query, [searchTerm]);

    return result.rows;
};

const createPaper = async (paperData) => {
    const query = `
        INSERT INTO papers (
            title,
            abstract,
            publication_year,
            doi,
            paper_type,
            file_url,
            area_id,
            venue_id,
            uploaded_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING
            paper_id,
            title,
            abstract,
            publication_year,
            doi,
            paper_type,
            file_url,
            area_id,
            venue_id,
            uploaded_by,
            created_at;
    `;

    const values = [
        paperData.title,
        paperData.abstract || null,
        paperData.publication_year,
        paperData.doi || null,
        paperData.paper_type || null,
        paperData.file_url || null,
        paperData.area_id,
        paperData.venue_id || null,
        paperData.uploaded_by
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};

const updatePaper = async (paperId, paperData) => {
    const query = `
        UPDATE papers
        SET
            title = $1,
            abstract = $2,
            publication_year = $3,
            doi = $4,
            paper_type = $5,
            file_url = $6,
            area_id = $7,
            venue_id = $8
        WHERE paper_id = $9
        RETURNING
            paper_id,
            title,
            abstract,
            publication_year,
            doi,
            paper_type,
            file_url,
            area_id,
            venue_id,
            uploaded_by,
            created_at;
    `;

    const values = [
        paperData.title,
        paperData.abstract || null,
        paperData.publication_year,
        paperData.doi || null,
        paperData.paper_type || null,
        paperData.file_url || null,
        paperData.area_id,
        paperData.venue_id || null,
        paperId
    ];

    const result = await pool.query(query, values);

    return result.rows[0] || null;
};

module.exports = {
    getAllPapers,
    getPaperById,
    searchPapers,
    createPaper,
    updatePaper
};