const pool = require("../config/db");

const getPaperAnalytics = async () => {
    const query = `
        SELECT *
        FROM paper_statistics
        ORDER BY publication_year DESC, title;
    `;

    const result = await pool.query(query);

    return result.rows;
};

const getAuthorAnalytics = async () => {
    const result = await pool.query(`
        SELECT
            author_id,
            author_name,
            affiliation,
            department,
            publication_count
        FROM author_productivity
        ORDER BY publication_count DESC, author_name ASC
    `);

    return result.rows;
};

const getAreaAnalytics = async () => {
    const result = await pool.query(`
        SELECT
            area_id,
            area_name,
            paper_count,
            researcher_count,
            citation_count
        FROM research_area_statistics
        ORDER BY paper_count DESC, area_name ASC
    `);

    return result.rows;
};

const getPaperDiscoveryAnalytics = async () => {
    const query = `
        SELECT *
        FROM paper_discovery_summary
        ORDER BY publication_year DESC, title;
    `;

    const result = await pool.query(query);

    return result.rows;
};

const getResearchTrends = async () => {
    const query = `
        SELECT
            publication_year,
            COUNT(*) AS paper_count
        FROM papers
        GROUP BY publication_year
        ORDER BY publication_year;
    `;

    const result = await pool.query(query);

    return result.rows;
};

const getPaperImpact = async (paperId) => {
    const query = `
        SELECT calculate_paper_impact($1) AS impact_score;
    `;

    const result = await pool.query(query, [paperId]);

    return result.rows[0];
};

module.exports = {
    getPaperAnalytics,
    getAuthorAnalytics,
    getAreaAnalytics,
    getPaperDiscoveryAnalytics,
    getResearchTrends,
    getPaperImpact
};