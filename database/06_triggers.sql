-- ============================================================
-- ResearchSphere
-- PostgreSQL Triggers and Audit Logging
-- ============================================================


-- ============================================================
-- TRIGGER FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION log_paper_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN

    -- --------------------------------------------------------
    -- INSERT
    -- --------------------------------------------------------

    IF TG_OP = 'INSERT' THEN

        INSERT INTO audit_log
        (
            user_id,
            paper_id,
            action,
            old_value,
            new_value
        )
        VALUES
        (
            NEW.uploaded_by,
            NEW.paper_id,
            'INSERT',
            NULL,
            ROW(
                NEW.title,
                NEW.publication_year,
                NEW.paper_type
            )::TEXT
        );

        RETURN NEW;

    END IF;


    -- --------------------------------------------------------
    -- UPDATE
    -- --------------------------------------------------------

    IF TG_OP = 'UPDATE' THEN

        INSERT INTO audit_log
        (
            user_id,
            paper_id,
            action,
            old_value,
            new_value
        )
        VALUES
        (
            NEW.uploaded_by,
            NEW.paper_id,
            'UPDATE',
            ROW(
                OLD.title,
                OLD.publication_year,
                OLD.paper_type
            )::TEXT,
            ROW(
                NEW.title,
                NEW.publication_year,
                NEW.paper_type
            )::TEXT
        );

        RETURN NEW;

    END IF;


    -- --------------------------------------------------------
    -- DELETE
    -- --------------------------------------------------------
    -- DELETE must be logged BEFORE the paper disappears.
    -- Therefore the trigger is defined as BEFORE DELETE.

    IF TG_OP = 'DELETE' THEN

        INSERT INTO audit_log
        (
            user_id,
            paper_id,
            action,
            old_value,
            new_value
        )
        VALUES
        (
            OLD.uploaded_by,
            OLD.paper_id,
            'DELETE',
            ROW(
                OLD.paper_id,
                OLD.title,
                OLD.publication_year,
                OLD.paper_type
            )::TEXT,
            NULL
        );

        RETURN OLD;

    END IF;


    RETURN NULL;

END;
$$;


-- ============================================================
-- TRIGGER
-- ============================================================
-- INSERT and UPDATE are logged after the operation.
-- DELETE is logged before the row is removed.
-- ============================================================

DROP TRIGGER IF EXISTS trg_paper_audit
ON papers;


CREATE TRIGGER trg_paper_audit
AFTER INSERT OR UPDATE
ON papers
FOR EACH ROW
EXECUTE FUNCTION log_paper_changes();


CREATE TRIGGER trg_paper_delete_audit
BEFORE DELETE
ON papers
FOR EACH ROW
EXECUTE FUNCTION log_paper_changes();