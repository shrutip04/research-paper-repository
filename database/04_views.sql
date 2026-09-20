-- ============================================================
-- ResearchSphere
-- Database Views
-- PostgreSQL 18
-- ============================================================


-- ============================================================
-- VIEW 1: PAPER STATISTICS
-- ============================================================
-- Provides a consolidated view of important paper-level
-- statistics including research area, authors, citations,
-- downloads and average rating.

CREATE OR REPLACE VIEW paper_statistics AS
SELECT
    p.paper_id,
    p.title,
    p.publication_year,
    p.paper_type,

    ra.area_name,

    pv.name AS publication_venue,

    COUNT(DISTINCT pa.author_id) AS author_count,

    COUNT(DISTINCT c.citation_id) AS citation_count,

    COUNT(DISTINCT d.download_id) AS download_count,

    ROUND(
        COALESCE(AVG(r.rating), 0),
        2
    ) AS average_rating

FROM papers p

JOIN research_areas ra
    ON p.area_id = ra.area_id

LEFT JOIN publication_venues pv
    ON p.venue_id = pv.venue_id

LEFT JOIN paper_authors pa
    ON p.paper_id = pa.paper_id

LEFT JOIN citations c
    ON p.paper_id = c.cited_paper_id

LEFT JOIN downloads d
    ON p.paper_id = d.paper_id

LEFT JOIN reviews r
    ON p.paper_id = r.paper_id

GROUP BY
    p.paper_id,
    p.title,
    p.publication_year,
    p.paper_type,
    ra.area_name,
    pv.name;


-- ============================================================
-- VIEW 2: AUTHOR PRODUCTIVITY
-- ============================================================
-- Shows the number of papers published by each author.

CREATE OR REPLACE VIEW author_productivity AS
SELECT
    a.author_id,
    a.name AS author_name,
    a.affiliation,
    a.department,

    COUNT(DISTINCT pa.paper_id) AS publication_count

FROM authors a

LEFT JOIN paper_authors pa
    ON a.author_id = pa.author_id

GROUP BY
    a.author_id,
    a.name,
    a.affiliation,
    a.department;


-- ============================================================
-- VIEW 3: RESEARCH AREA STATISTICS
-- ============================================================
-- Provides statistics for each research area.

CREATE OR REPLACE VIEW research_area_statistics AS
SELECT
    ra.area_id,
    ra.area_name,

    COUNT(DISTINCT p.paper_id) AS paper_count,

    COUNT(DISTINCT pa.author_id) AS researcher_count,

    COUNT(DISTINCT c.citation_id) AS citation_count

FROM research_areas ra

LEFT JOIN papers p
    ON ra.area_id = p.area_id

LEFT JOIN paper_authors pa
    ON p.paper_id = pa.paper_id

LEFT JOIN citations c
    ON p.paper_id = c.cited_paper_id

GROUP BY
    ra.area_id,
    ra.area_name;


-- ============================================================
-- VIEW 4: PAPER DISCOVERY SUMMARY
-- ============================================================
-- Combines paper information with its authors and keywords.
-- Useful for search and discovery features.

CREATE OR REPLACE VIEW paper_discovery_summary AS
SELECT
    p.paper_id,
    p.title,
    p.publication_year,
    ra.area_name,

    STRING_AGG(
        DISTINCT a.name,
        ', '
        ORDER BY a.name
    ) AS authors,

    STRING_AGG(
        DISTINCT k.keyword_name,
        ', '
        ORDER BY k.keyword_name
    ) AS keywords

FROM papers p

JOIN research_areas ra
    ON p.area_id = ra.area_id

LEFT JOIN paper_authors pa
    ON p.paper_id = pa.paper_id

LEFT JOIN authors a
    ON pa.author_id = a.author_id

LEFT JOIN paper_keywords pk
    ON p.paper_id = pk.paper_id

LEFT JOIN keywords k
    ON pk.keyword_id = k.keyword_id

GROUP BY
    p.paper_id,
    p.title,
    p.publication_year,
    ra.area_name;