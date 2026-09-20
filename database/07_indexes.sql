-- ============================================================
-- ResearchSphere
-- PostgreSQL Indexes and Query Optimization
-- ============================================================

-- ------------------------------------------------------------
-- 1. Search and filtering on papers
-- ------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_papers_area_year
ON papers(area_id, publication_year);

-- ------------------------------------------------------------
-- 2. Author-based paper discovery
-- ------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_paper_authors_author
ON paper_authors(author_id);

-- ------------------------------------------------------------
-- 3. Citation network queries
-- ------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_citations_cited_paper
ON citations(cited_paper_id);

CREATE INDEX IF NOT EXISTS idx_citations_citing_paper
ON citations(citing_paper_id);

-- ------------------------------------------------------------
-- 4. User interaction analytics
-- ------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_downloads_paper
ON downloads(paper_id);

CREATE INDEX IF NOT EXISTS idx_reviews_paper
ON reviews(paper_id);

CREATE INDEX IF NOT EXISTS idx_bookmarks_paper
ON bookmarks(paper_id);

-- ------------------------------------------------------------
-- 5. Paper keyword discovery
-- ------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_paper_keywords_keyword
ON paper_keywords(keyword_id);

-- ------------------------------------------------------------
-- 6. Query optimization examples
-- ------------------------------------------------------------

-- PostgreSQL can use the composite index
-- idx_papers_area_year for queries filtering
-- by research area and publication year.

EXPLAIN
SELECT
    paper_id,
    title,
    publication_year
FROM papers
WHERE area_id = 1
  AND publication_year >= 2023;

-- Citation lookup optimization

EXPLAIN
SELECT
    citing_paper_id,
    cited_paper_id
FROM citations
WHERE cited_paper_id = 1;

-- Author publication lookup optimization

EXPLAIN
SELECT
    paper_id,
    author_id,
    author_order
FROM paper_authors
WHERE author_id = 1;