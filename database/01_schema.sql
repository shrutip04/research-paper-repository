-- ============================================================
-- ResearchSphere
-- Research Paper Repository & Discovery System
-- PostgreSQL 18
-- ============================================================

-- ============================================================
-- 1. USERS
-- ============================================================

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'STUDENT',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_user_role
        CHECK (role IN ('STUDENT', 'RESEARCHER', 'FACULTY', 'ADMIN'))
);


-- ============================================================
-- 2. AUTHORS
-- ============================================================

CREATE TABLE authors (
    author_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE,
    affiliation VARCHAR(200),
    department VARCHAR(150),
    bio TEXT
);


-- ============================================================
-- 3. RESEARCH AREAS
-- ============================================================

CREATE TABLE research_areas (
    area_id SERIAL PRIMARY KEY,
    area_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);


-- ============================================================
-- 4. PUBLICATION VENUES
-- ============================================================

CREATE TABLE publication_venues (
    venue_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    venue_type VARCHAR(30) NOT NULL,
    publisher VARCHAR(150),
    issn VARCHAR(50),

    CONSTRAINT chk_venue_type
        CHECK (
            venue_type IN (
                'JOURNAL',
                'CONFERENCE',
                'WORKSHOP',
                'SYMPOSIUM'
            )
        )
);


-- ============================================================
-- 5. KEYWORDS
-- ============================================================

CREATE TABLE keywords (
    keyword_id SERIAL PRIMARY KEY,
    keyword_name VARCHAR(100) NOT NULL UNIQUE
);


-- ============================================================
-- 6. PAPERS
-- ============================================================

CREATE TABLE papers (
    paper_id SERIAL PRIMARY KEY,

    title VARCHAR(300) NOT NULL,

    abstract TEXT,

    publication_year INT NOT NULL,

    doi VARCHAR(150) UNIQUE,

    paper_type VARCHAR(30) NOT NULL DEFAULT 'RESEARCH',

    file_url TEXT,

    area_id INT NOT NULL,

    venue_id INT,

    uploaded_by INT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_publication_year
        CHECK (publication_year BETWEEN 1900 AND 2100),

    CONSTRAINT chk_paper_type
        CHECK (
            paper_type IN (
                'RESEARCH',
                'REVIEW',
                'SURVEY',
                'CASE_STUDY',
                'SHORT_PAPER'
            )
        ),

    CONSTRAINT fk_paper_area
        FOREIGN KEY (area_id)
        REFERENCES research_areas(area_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_paper_venue
        FOREIGN KEY (venue_id)
        REFERENCES publication_venues(venue_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_paper_uploader
        FOREIGN KEY (uploaded_by)
        REFERENCES users(user_id)
        ON DELETE RESTRICT
);


-- ============================================================
-- 7. PAPER_AUTHORS
-- ============================================================

CREATE TABLE paper_authors (
    paper_id INT NOT NULL,

    author_id INT NOT NULL,

    author_order INT NOT NULL,

    PRIMARY KEY (paper_id, author_id),

    CONSTRAINT chk_author_order
        CHECK (author_order > 0),

    CONSTRAINT fk_paper_author_paper
        FOREIGN KEY (paper_id)
        REFERENCES papers(paper_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_paper_author_author
        FOREIGN KEY (author_id)
        REFERENCES authors(author_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 8. PAPER_KEYWORDS
-- ============================================================

CREATE TABLE paper_keywords (
    paper_id INT NOT NULL,

    keyword_id INT NOT NULL,

    PRIMARY KEY (paper_id, keyword_id),

    CONSTRAINT fk_paper_keyword_paper
        FOREIGN KEY (paper_id)
        REFERENCES papers(paper_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_paper_keyword_keyword
        FOREIGN KEY (keyword_id)
        REFERENCES keywords(keyword_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 9. CITATIONS
-- ============================================================

CREATE TABLE citations (
    citation_id SERIAL PRIMARY KEY,

    citing_paper_id INT NOT NULL,

    cited_paper_id INT NOT NULL,

    citation_context TEXT,

    CONSTRAINT chk_no_self_citation
        CHECK (citing_paper_id <> cited_paper_id),

    CONSTRAINT fk_citing_paper
        FOREIGN KEY (citing_paper_id)
        REFERENCES papers(paper_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_cited_paper
        FOREIGN KEY (cited_paper_id)
        REFERENCES papers(paper_id)
        ON DELETE CASCADE,

    CONSTRAINT uq_paper_citation
        UNIQUE (citing_paper_id, cited_paper_id)
);


-- ============================================================
-- 10. REVIEWS
-- ============================================================

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,

    user_id INT NOT NULL,

    paper_id INT NOT NULL,

    rating INT NOT NULL,

    comment TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_rating
        CHECK (rating BETWEEN 1 AND 5),

    CONSTRAINT uq_user_paper_review
        UNIQUE (user_id, paper_id),

    CONSTRAINT fk_review_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_paper
        FOREIGN KEY (paper_id)
        REFERENCES papers(paper_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 11. BOOKMARKS
-- ============================================================

CREATE TABLE bookmarks (
    bookmark_id SERIAL PRIMARY KEY,

    user_id INT NOT NULL,

    paper_id INT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_user_paper_bookmark
        UNIQUE (user_id, paper_id),

    CONSTRAINT fk_bookmark_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_bookmark_paper
        FOREIGN KEY (paper_id)
        REFERENCES papers(paper_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 12. DOWNLOADS
-- ============================================================

CREATE TABLE downloads (
    download_id SERIAL PRIMARY KEY,

    user_id INT NOT NULL,

    paper_id INT NOT NULL,

    downloaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_download_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_download_paper
        FOREIGN KEY (paper_id)
        REFERENCES papers(paper_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 13. AUDIT LOG
-- ============================================================

CREATE TABLE audit_log (
    audit_id SERIAL PRIMARY KEY,

    user_id INT,

    paper_id INT,

    action VARCHAR(20) NOT NULL,

    old_value TEXT,

    new_value TEXT,

    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_audit_action
        CHECK (
            action IN (
                'INSERT',
                'UPDATE',
                'DELETE'
            )
        ),

    CONSTRAINT fk_audit_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_audit_paper
        FOREIGN KEY (paper_id)
        REFERENCES papers(paper_id)
        ON DELETE SET NULL
);
