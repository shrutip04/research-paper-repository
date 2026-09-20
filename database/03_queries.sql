-- ============================================================
-- ResearchSphere
-- SQL Queries and DBMS Operations
-- ============================================================


-- ============================================================
-- SECTION A — BASIC RETRIEVAL
-- ============================================================

-- Q01. Display all research papers
SELECT *
FROM papers;


-- Q02. Display paper titles and publication years
SELECT
    title,
    publication_year
FROM papers
ORDER BY publication_year DESC;


-- Q03. Find papers published after 2022
SELECT
    paper_id,
    title,
    publication_year
FROM papers
WHERE publication_year > 2022
ORDER BY publication_year DESC;


-- Q04. Find all papers belonging to Computer Vision
SELECT
    p.paper_id,
    p.title,
    p.publication_year
FROM papers p
JOIN research_areas ra
    ON p.area_id = ra.area_id
WHERE ra.area_name = 'Computer Vision';


-- Q05. Find all research papers of type REVIEW or SURVEY
SELECT
    paper_id,
    title,
    paper_type
FROM papers
WHERE paper_type IN ('REVIEW', 'SURVEY');


-- Q06. Find papers whose title contains the word "Machine"
SELECT
    paper_id,
    title,
    publication_year
FROM papers
WHERE title ILIKE '%Machine%'
ORDER BY publication_year DESC;


-- ============================================================
-- SECTION B — JOIN OPERATIONS
-- ============================================================

-- Q07. Display papers with their research areas
SELECT
    p.title,
    ra.area_name
FROM papers p
INNER JOIN research_areas ra
    ON p.area_id = ra.area_id
ORDER BY ra.area_name;


-- Q08. Display papers along with their publication venue
SELECT
    p.title,
    pv.name AS publication_venue,
    pv.venue_type
FROM papers p
LEFT JOIN publication_venues pv
    ON p.venue_id = pv.venue_id
ORDER BY p.title;


-- Q09. Display each paper with its authors
SELECT
    p.title AS paper_title,
    a.name AS author_name,
    pa.author_order
FROM papers p
JOIN paper_authors pa
    ON p.paper_id = pa.paper_id
JOIN authors a
    ON pa.author_id = a.author_id
ORDER BY p.paper_id, pa.author_order;


-- Q10. Display each paper with its keywords
SELECT
    p.title AS paper_title,
    k.keyword_name
FROM papers p
JOIN paper_keywords pk
    ON p.paper_id = pk.paper_id
JOIN keywords k
    ON pk.keyword_id = k.keyword_id
ORDER BY p.paper_id, k.keyword_name;


-- Q11. Display papers together with their average rating
SELECT
    p.paper_id,
    p.title,
    ROUND(AVG(r.rating), 2) AS average_rating
FROM papers p
JOIN reviews r
    ON p.paper_id = r.paper_id
GROUP BY p.paper_id, p.title
ORDER BY average_rating DESC;


-- Q12. Display users and the papers they have bookmarked
SELECT
    u.name AS user_name,
    p.title AS bookmarked_paper
FROM users u
JOIN bookmarks b
    ON u.user_id = b.user_id
JOIN papers p
    ON b.paper_id = p.paper_id
ORDER BY u.name, p.title;


-- Q13. Display papers with their number of downloads
SELECT
    p.paper_id,
    p.title,
    COUNT(d.download_id) AS download_count
FROM papers p
LEFT JOIN downloads d
    ON p.paper_id = d.paper_id
GROUP BY p.paper_id, p.title
ORDER BY download_count DESC;

-- ============================================================
-- SECTION C — AGGREGATION & RESEARCH ANALYTICS
-- ============================================================


-- Q14. Count the total number of papers
SELECT
    COUNT(*) AS total_papers
FROM papers;


-- Q15. Count papers published in each research area
SELECT
    ra.area_name,
    COUNT(p.paper_id) AS paper_count
FROM research_areas ra
LEFT JOIN papers p
    ON ra.area_id = p.area_id
GROUP BY ra.area_id, ra.area_name
ORDER BY paper_count DESC;


-- Q16. Find research areas having more than 2 papers
SELECT
    ra.area_name,
    COUNT(p.paper_id) AS paper_count
FROM research_areas ra
JOIN papers p
    ON ra.area_id = p.area_id
GROUP BY ra.area_id, ra.area_name
HAVING COUNT(p.paper_id) > 2
ORDER BY paper_count DESC;


-- Q17. Find the most productive authors
SELECT
    a.author_id,
    a.name AS author_name,
    COUNT(pa.paper_id) AS publication_count
FROM authors a
JOIN paper_authors pa
    ON a.author_id = pa.author_id
GROUP BY a.author_id, a.name
ORDER BY publication_count DESC;


-- Q18. Find the most cited papers
SELECT
    p.paper_id,
    p.title,
    COUNT(c.citation_id) AS citation_count
FROM papers p
LEFT JOIN citations c
    ON p.paper_id = c.cited_paper_id
GROUP BY p.paper_id, p.title
ORDER BY citation_count DESC, p.title;


-- Q19. Find the most downloaded papers
SELECT
    p.paper_id,
    p.title,
    COUNT(d.download_id) AS download_count
FROM papers p
LEFT JOIN downloads d
    ON p.paper_id = d.paper_id
GROUP BY p.paper_id, p.title
ORDER BY download_count DESC, p.title;


-- Q20. Calculate average rating for each research area
SELECT
    ra.area_name,
    ROUND(AVG(r.rating), 2) AS average_rating
FROM research_areas ra
JOIN papers p
    ON ra.area_id = p.area_id
JOIN reviews r
    ON p.paper_id = r.paper_id
GROUP BY ra.area_id, ra.area_name
ORDER BY average_rating DESC;


-- Q21. Find publication statistics by year
SELECT
    publication_year,
    COUNT(*) AS paper_count
FROM papers
GROUP BY publication_year
ORDER BY publication_year;


-- Q22. Find the number of papers published by each venue
SELECT
    pv.name AS publication_venue,
    COUNT(p.paper_id) AS paper_count
FROM publication_venues pv
LEFT JOIN papers p
    ON pv.venue_id = p.venue_id
GROUP BY pv.venue_id, pv.name
ORDER BY paper_count DESC;


-- Q23. Find authors who have published more than 2 papers
SELECT
    a.name AS author_name,
    COUNT(pa.paper_id) AS publication_count
FROM authors a
JOIN paper_authors pa
    ON a.author_id = pa.author_id
GROUP BY a.author_id, a.name
HAVING COUNT(pa.paper_id) > 2
ORDER BY publication_count DESC;


-- Q24. Find the average number of authors per paper
SELECT
    ROUND(AVG(author_count), 2) AS average_authors_per_paper
FROM (
    SELECT
        paper_id,
        COUNT(author_id) AS author_count
    FROM paper_authors
    GROUP BY paper_id
) AS paper_author_stats;

-- ============================================================
-- SECTION D — SUBQUERIES & ADVANCED SQL
-- ============================================================


-- Q25. Find papers with a rating higher than the overall
-- average paper rating
SELECT
    p.paper_id,
    p.title
FROM papers p
JOIN reviews r
    ON p.paper_id = r.paper_id
GROUP BY p.paper_id, p.title
HAVING AVG(r.rating) > (
    SELECT AVG(rating)
    FROM reviews
    );


-- Q26. Find authors who have written at least one paper
-- in the Artificial Intelligence research area
SELECT
    a.author_id,
    a.name
FROM authors a
WHERE a.author_id IN (
    SELECT pa.author_id
    FROM paper_authors pa
    JOIN papers p
        ON pa.paper_id = p.paper_id
    JOIN research_areas ra
        ON p.area_id = ra.area_id
    WHERE ra.area_name = 'Artificial Intelligence'
);


-- Q27. Find papers that have received at least one citation
SELECT
    p.paper_id,
    p.title
FROM papers p
WHERE EXISTS (
    SELECT 1
    FROM citations c
    WHERE c.cited_paper_id = p.paper_id
)
ORDER BY p.paper_id;


-- Q28. Find papers that have never been downloaded
SELECT
    p.paper_id,
    p.title
FROM papers p
WHERE NOT EXISTS (
    SELECT 1
    FROM downloads d
    WHERE d.paper_id = p.paper_id
);


-- Q29. Find authors whose publication count is above
-- the average author publication count
SELECT
    a.author_id,
    a.name,
    COUNT(pa.paper_id) AS publication_count
FROM authors a
JOIN paper_authors pa
    ON a.author_id = pa.author_id
GROUP BY a.author_id, a.name
HAVING COUNT(pa.paper_id) > (
    SELECT AVG(publication_count)
    FROM (
        SELECT
            COUNT(paper_id) AS publication_count
        FROM paper_authors
        GROUP BY author_id
    ) AS author_statistics
)
ORDER BY publication_count DESC;


-- Q30. Categorize papers based on their citation count
WITH citation_counts AS (
    SELECT
        p.paper_id,
        p.title,
        COUNT(c.citation_id) AS citation_count
    FROM papers p
    LEFT JOIN citations c
        ON p.paper_id = c.cited_paper_id
    GROUP BY p.paper_id, p.title
)
SELECT
    paper_id,
    title,
    citation_count,
    CASE
        WHEN citation_count >= 4 THEN 'Highly Cited'
        WHEN citation_count >= 2 THEN 'Moderately Cited'
        ELSE 'Low Citation'
    END AS citation_category
FROM citation_counts
ORDER BY citation_count DESC;


-- Q31. Find papers related to a selected paper
-- based on shared research area
-- Selected paper: Paper 1
SELECT
    p2.paper_id,
    p2.title,
    ra.area_name
FROM papers p1
JOIN papers p2
    ON p1.area_id = p2.area_id
JOIN research_areas ra
    ON p2.area_id = ra.area_id
WHERE p1.paper_id = 1
  AND p2.paper_id <> p1.paper_id
ORDER BY p2.title;


-- Q32. Find papers related to Paper 1
-- based on shared keywords
SELECT DISTINCT
    p2.paper_id,
    p2.title
FROM paper_keywords pk1
JOIN paper_keywords pk2
    ON pk1.keyword_id = pk2.keyword_id
JOIN papers p2
    ON pk2.paper_id = p2.paper_id
WHERE pk1.paper_id = 1
  AND p2.paper_id <> 1
ORDER BY p2.paper_id;


-- Q33. Find authors who collaborated with Ananya Rao
SELECT DISTINCT
    a2.author_id,
    a2.name AS collaborator
FROM paper_authors pa1
JOIN paper_authors pa2
    ON pa1.paper_id = pa2.paper_id
JOIN authors a1
    ON pa1.author_id = a1.author_id
JOIN authors a2
    ON pa2.author_id = a2.author_id
WHERE a1.name = 'Ananya Rao'
  AND a2.author_id <> a1.author_id
ORDER BY a2.name;


-- Q34. Find papers that cite a paper related to
-- Computer Vision
SELECT DISTINCT
    p.title
FROM citations c
JOIN papers p
    ON c.citing_paper_id = p.paper_id
JOIN papers cited
    ON c.cited_paper_id = cited.paper_id
JOIN research_areas ra
    ON cited.area_id = ra.area_id
WHERE ra.area_name = 'Computer Vision'
ORDER BY p.title;


-- Q35. Find the highest-rated paper
SELECT
    p.paper_id,
    p.title,
    ROUND(AVG(r.rating), 2) AS average_rating
FROM papers p
JOIN reviews r
    ON p.paper_id = r.paper_id
GROUP BY p.paper_id, p.title
HAVING AVG(r.rating) = (
    SELECT MAX(avg_rating)
    FROM (
        SELECT AVG(rating) AS avg_rating
        FROM reviews
        GROUP BY paper_id
    ) AS paper_ratings
);


-- Q36. Find users who have bookmarked at least one
-- paper from the Machine Learning research area
SELECT DISTINCT
    u.user_id,
    u.name
FROM users u
JOIN bookmarks b
    ON u.user_id = b.user_id
JOIN papers p
    ON b.paper_id = p.paper_id
JOIN research_areas ra
    ON p.area_id = ra.area_id
WHERE ra.area_name = 'Machine Learning'
ORDER BY u.name;

-- ============================================================
-- SECTION E — DML OPERATIONS
-- ============================================================


-- Q37. Insert a new research keyword
INSERT INTO keywords (keyword_name)
VALUES ('Federated Learning');


-- Q38. Update the description of a research area
UPDATE research_areas
SET description =
    'Algorithms and statistical methods for learning from data,
     including supervised, unsupervised and federated learning.'
WHERE area_name = 'Machine Learning';


-- Q39. Update the publication type of a paper
UPDATE papers
SET paper_type = 'REVIEW'
WHERE paper_id = 4;


-- Q40. Delete the keyword added for demonstration
DELETE FROM keywords
WHERE keyword_name = 'Federated Learning';


-- ============================================================
-- SECTION F — TRANSACTIONS
-- ============================================================


-- Q41. Demonstrate a successful transaction
BEGIN;

INSERT INTO bookmarks (user_id, paper_id)
VALUES (10, 15);

COMMIT;


-- Q42. Demonstrate transaction rollback
BEGIN;

INSERT INTO bookmarks (user_id, paper_id)
VALUES (10, 18);

ROLLBACK;


-- ============================================================
-- SECTION G — ADDITIONAL ANALYTICAL QUERIES
-- ============================================================


-- Q43. Find the top 5 most downloaded papers
SELECT
    p.paper_id,
    p.title,
    COUNT(d.download_id) AS download_count
FROM papers p
LEFT JOIN downloads d
    ON p.paper_id = d.paper_id
GROUP BY p.paper_id, p.title
ORDER BY download_count DESC
LIMIT 5;


-- Q44. Find the research area with the highest number
-- of published papers
SELECT
    ra.area_name,
    COUNT(p.paper_id) AS paper_count
FROM research_areas ra
JOIN papers p
    ON ra.area_id = p.area_id
GROUP BY ra.area_id, ra.area_name
ORDER BY paper_count DESC
LIMIT 1;


-- Q45. Find papers having both citations and downloads
SELECT
    p.paper_id,
    p.title,
    COUNT(DISTINCT c.citation_id) AS citation_count,
    COUNT(DISTINCT d.download_id) AS download_count
FROM papers p
JOIN citations c
    ON p.paper_id = c.cited_paper_id
JOIN downloads d
    ON p.paper_id = d.paper_id
GROUP BY p.paper_id, p.title
ORDER BY citation_count DESC, download_count DESC;

