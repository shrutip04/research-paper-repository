const pool = require("../config/db");

const getRelatedPapers = async (paperId) => {
    const query = `
        WITH target_paper AS (
            SELECT
                area_id
            FROM papers
            WHERE paper_id = $1
        ),

        shared_keywords AS (
            SELECT
                pk2.paper_id,
                COUNT(*) AS shared_keyword_count
            FROM paper_keywords pk1
            INNER JOIN paper_keywords pk2
                ON pk1.keyword_id = pk2.keyword_id
            WHERE pk1.paper_id = $1
              AND pk2.paper_id <> $1
            GROUP BY pk2.paper_id
        ),

        shared_authors AS (
            SELECT
                pa2.paper_id,
                COUNT(*) AS shared_author_count
            FROM paper_authors pa1
            INNER JOIN paper_authors pa2
                ON pa1.author_id = pa2.author_id
            WHERE pa1.paper_id = $1
              AND pa2.paper_id <> $1
            GROUP BY pa2.paper_id
        )

        SELECT
            p.paper_id,
            p.title,
            p.abstract,
            p.publication_year,
            p.paper_type,
            ra.area_name,
            pv.name AS venue_name,

            COALESCE(sk.shared_keyword_count, 0) AS shared_keywords,
            COALESCE(sa.shared_author_count, 0) AS shared_authors,

            CASE
                WHEN p.area_id = tp.area_id THEN 5
                ELSE 0
            END
            +
            COALESCE(sk.shared_keyword_count, 0) * 2
            +
            COALESCE(sa.shared_author_count, 0) * 3
            AS relevance_score

        FROM papers p

        CROSS JOIN target_paper tp

        INNER JOIN research_areas ra
            ON p.area_id = ra.area_id

        LEFT JOIN publication_venues pv
            ON p.venue_id = pv.venue_id

        LEFT JOIN shared_keywords sk
            ON p.paper_id = sk.paper_id

        LEFT JOIN shared_authors sa
            ON p.paper_id = sa.paper_id

        WHERE p.paper_id <> $1
          AND (
              p.area_id = tp.area_id
              OR sk.paper_id IS NOT NULL
              OR sa.paper_id IS NOT NULL
          )

        ORDER BY
            relevance_score DESC,
            p.publication_year DESC,
            p.title;
    `;

    const result = await pool.query(query, [paperId]);

    return result.rows;
};

module.exports = {
    getRelatedPapers
};