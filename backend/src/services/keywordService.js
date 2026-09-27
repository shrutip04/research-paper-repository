const pool = require("../config/db");

const getAllKeywords = async () => {
    const query = `
        SELECT
            keyword_id,
            keyword_name
        FROM keywords
        ORDER BY keyword_name;
    `;

    const result = await pool.query(query);
    return result.rows;
};

const getKeywordPapers = async (keywordId) => {
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
        INNER JOIN paper_keywords pk
            ON p.paper_id = pk.paper_id
        INNER JOIN keywords k
            ON pk.keyword_id = k.keyword_id
        INNER JOIN research_areas ra
            ON p.area_id = ra.area_id
        LEFT JOIN publication_venues pv
            ON p.venue_id = pv.venue_id
        WHERE k.keyword_id = $1
        ORDER BY p.publication_year DESC, p.title;
    `;

    const result = await pool.query(query, [keywordId]);
    return result.rows;
};

// ==========================================
// ATTACH KEYWORDS TO A PAPER (paper_keywords)
// ==========================================

const addPaperKeywords = async (paperId, keywordIds) => {
    const values = [];
    const rows = keywordIds.map((keywordId) => {
        const offset = values.length;
        values.push(paperId, keywordId);
        return `($${offset + 1}, $${offset + 2})`;
    });

    const query = `
        INSERT INTO paper_keywords (paper_id, keyword_id)
        VALUES ${rows.join(", ")}
        ON CONFLICT (paper_id, keyword_id) DO NOTHING
        RETURNING paper_id, keyword_id;
    `;

    const result = await pool.query(query, values);

    return result.rows;
};


module.exports = {
    getAllKeywords,
    getKeywordPapers,
    addPaperKeywords
};