const pool = require("../config/db");

const getAllAuthors = async () => {
    const query = `
        SELECT
            author_id,
            name,
            email,
            affiliation,
            department,
            bio
        FROM authors
        ORDER BY name;
    `;

    const result = await pool.query(query);

    return result.rows;
};

const getAuthorById = async (authorId) => {
    const query = `
        SELECT
            author_id,
            name,
            email,
            affiliation,
            department,
            bio
        FROM authors
        WHERE author_id = $1;
    `;

    const result = await pool.query(query, [authorId]);

    return result.rows[0] || null;
};

const getAuthorPapers = async (authorId) => {
    const query = `
        SELECT
            p.paper_id,
            p.title,
            p.publication_year,
            p.paper_type,
            ra.area_name
        FROM papers p
        INNER JOIN paper_authors pa
            ON p.paper_id = pa.paper_id
        INNER JOIN research_areas ra
            ON p.area_id = ra.area_id
        WHERE pa.author_id = $1
        ORDER BY p.publication_year DESC;
    `;

    const result = await pool.query(query, [authorId]);

    return result.rows;
};

const getAuthorCollaborations = async (authorId) => {
    const query = `
        SELECT
            a.author_id,
            a.name,
            a.affiliation,
            COUNT(DISTINCT pa1.paper_id) AS shared_papers
        FROM paper_authors pa1
        INNER JOIN paper_authors pa2
            ON pa1.paper_id = pa2.paper_id
        INNER JOIN authors a
            ON pa2.author_id = a.author_id
        WHERE pa1.author_id = $1
          AND pa2.author_id <> $1
        GROUP BY
            a.author_id,
            a.name,
            a.affiliation
        ORDER BY shared_papers DESC, a.name;
    `;

    const result = await pool.query(query, [authorId]);

    return result.rows;
};

// ==========================================
// ATTACH AUTHORS TO A PAPER (paper_authors)
// ==========================================

const addPaperAuthors = async (paperId, authorIds) => {
    // author_order reflects the order the frontend submitted them in
    const values = [];
    const rows = authorIds.map((authorId, index) => {
        const offset = values.length;
        values.push(paperId, authorId, index + 1);
        return `($${offset + 1}, $${offset + 2}, $${offset + 3})`;
    });

    const query = `
        INSERT INTO paper_authors (paper_id, author_id, author_order)
        VALUES ${rows.join(", ")}
        ON CONFLICT (paper_id, author_id) DO NOTHING
        RETURNING paper_id, author_id, author_order;
    `;

    const result = await pool.query(query, values);

    return result.rows;
};

// ==========================================
// CREATE A NEW AUTHOR
// (used by the paper submission form's
// "add a new author" quick-add)
// ==========================================

const createAuthor = async (authorData) => {
    const query = `
        INSERT INTO authors (
            name,
            email,
            affiliation,
            department,
            bio
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            author_id,
            name,
            email,
            affiliation,
            department,
            bio;
    `;

    const values = [
        authorData.name,
        authorData.email || null,
        authorData.affiliation || null,
        authorData.department || null,
        authorData.bio || null
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};

module.exports = {
    getAllAuthors,
    getAuthorById,
    getAuthorPapers,
    getAuthorCollaborations,
    addPaperAuthors,
    createAuthor
};