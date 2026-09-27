const pool = require("../config/db");


const getAllVenues = async () => {
    const result = await pool.query(`
        SELECT
            venue_id,
            name,
            venue_type,
            publisher,
            issn
        FROM publication_venues
        ORDER BY name;
    `);

    return result.rows;
};


module.exports = {
    getAllVenues
};