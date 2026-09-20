-- ============================================================
-- ResearchSphere
-- PostgreSQL Functions
-- ============================================================


-- ============================================================
-- FUNCTION 1: CALCULATE PAPER IMPACT
-- ============================================================
-- Calculates an application-defined ResearchSphere Impact
-- Indicator using:
--   Citations
--   Downloads
--   Bookmarks
--   Average Rating
--
-- NOTE:
-- This is an application-specific indicator.
-- It is NOT a standard academic citation metric.
-- ============================================================

CREATE OR REPLACE FUNCTION calculate_paper_impact(
    input_paper_id INT
)
RETURNS NUMERIC(10,2)
LANGUAGE plpgsql
AS $$
DECLARE

    citation_count INT;

    download_count INT;

    bookmark_count INT;

    average_rating NUMERIC;

    impact_score NUMERIC;

BEGIN

    SELECT
        COUNT(*)
    INTO citation_count
    FROM citations
    WHERE cited_paper_id = input_paper_id;


    SELECT
        COUNT(*)
    INTO download_count
    FROM downloads
    WHERE paper_id = input_paper_id;


    SELECT
        COUNT(*)
    INTO bookmark_count
    FROM bookmarks
    WHERE paper_id = input_paper_id;


    SELECT
        COALESCE(AVG(rating), 0)
    INTO average_rating
    FROM reviews
    WHERE paper_id = input_paper_id;


    impact_score :=
          (citation_count * 5)
        + (download_count * 2)
        + (bookmark_count * 3)
        + (average_rating * 2);


    RETURN ROUND(impact_score, 2);

END;
$$;


-- ============================================================
-- FUNCTION 2: SEARCH PAPERS
-- ============================================================
-- Searches papers by:
--   Title
--   Abstract
--   DOI
--
-- Example:
-- SELECT * FROM search_papers('machine');
-- ============================================================

CREATE OR REPLACE FUNCTION search_papers(
    search_term TEXT
)
RETURNS TABLE (
    paper_id INT,
    title VARCHAR(300),
    publication_year INT,
    paper_type VARCHAR(30),
    area_name VARCHAR(100)
)
LANGUAGE plpgsql
AS $$
BEGIN

    RETURN QUERY

    SELECT
        p.paper_id,
        p.title,
        p.publication_year,
        p.paper_type,
        ra.area_name

    FROM papers p

    JOIN research_areas ra
        ON p.area_id = ra.area_id

    WHERE
        p.title ILIKE '%' || search_term || '%'
        OR p.abstract ILIKE '%' || search_term || '%'
        OR p.doi ILIKE '%' || search_term || '%'

    ORDER BY
        p.publication_year DESC;

END;
$$;