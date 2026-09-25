import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function PaperDetails() {
    const { id } = useParams();

    // Paper
    const [paper, setPaper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Bookmark
    const [bookmarked, setBookmarked] = useState(false);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);

    // Downloads
    const [downloadCount, setDownloadCount] = useState(0);
    const [downloadLoading, setDownloadLoading] = useState(false);

    // Citations
    const [citations, setCitations] = useState([]);
    const [citedBy, setCitedBy] = useState([]);
    const [citationStats, setCitationStats] = useState(null);

    // Related Papers
    const [relatedPapers, setRelatedPapers] = useState([]);

    // Impact indicator (application-defined, not an official academic metric)
    const [impactScore, setImpactScore] = useState(null);

    // Reviews
    const [reviews, setReviews] = useState([]);
    const [reviewSummary, setReviewSummary] = useState({
        review_count: 0,
        average_rating: 0,
    });

    const [reviewRating, setReviewRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState("");
    const [reviewSuccess, setReviewSuccess] = useState("");

    useEffect(() => {
        const fetchPaper = async () => {
            try {
                setLoading(true);
                setError("");

                // ==========================================
                // FETCH PAPER
                // ==========================================

                const response = await api.get(`/papers/${id}`);

                const data =
                    response.data?.paper ||
                    response.data?.data ||
                    response.data;

                setPaper(data);

                // ==========================================
                // FETCH DOWNLOAD STATISTICS
                // ==========================================

                try {
                    const downloadResponse = await api.get(
                        `/papers/${id}/downloads`
                    );

                    const downloadData =
                        downloadResponse.data?.downloads ||
                        downloadResponse.data?.data ||
                        downloadResponse.data;

                    if (Array.isArray(downloadData)) {
                        setDownloadCount(downloadData.length);
                    } else if (typeof downloadData === "number") {
                        setDownloadCount(downloadData);
                    } else if (
                        downloadData?.count !== undefined
                    ) {
                        setDownloadCount(downloadData.count);
                    }
                } catch (downloadError) {
                    console.error(
                        "Error fetching downloads:",
                        downloadError
                    );
                }

                // ==========================================
                // FETCH CITATION INFORMATION
                // ==========================================

                try {
                    const [
                        citationsResponse,
                        citedByResponse,
                        statsResponse,
                    ] = await Promise.all([
                        api.get(`/papers/${id}/citations`),
                        api.get(`/papers/${id}/cited-by`),
                        api.get(`/papers/${id}/citation-stats`),
                    ]);

                    const citationsData =
                        citationsResponse.data?.citations ||
                        citationsResponse.data?.data ||
                        citationsResponse.data;

                    const citedByData =
                        citedByResponse.data?.citedBy ||
                        citedByResponse.data?.cited_by ||
                        citedByResponse.data?.data ||
                        citedByResponse.data;

                    const statsData =
                        statsResponse.data?.stats ||
                        statsResponse.data?.data ||
                        statsResponse.data;

                    if (Array.isArray(citationsData)) {
                        setCitations(citationsData);
                    }

                    if (Array.isArray(citedByData)) {
                        setCitedBy(citedByData);
                    }

                    setCitationStats(statsData);
                } catch (citationError) {
                    console.error(
                        "Error fetching citation data:",
                        citationError
                    );
                }

                // ==========================================
                // FETCH IMPACT INDICATOR
                // ==========================================

                try {
                    const impactResponse = await api.get(
                        `/papers/${id}/impact`
                    );

                    const impactData =
                        impactResponse.data?.data?.impact_score ??
                        impactResponse.data?.data;

                    setImpactScore(impactData);
                } catch (impactError) {
                    console.error(
                        "Error fetching impact indicator:",
                        impactError
                    );
                }

                // ==========================================
                // FETCH RELATED PAPERS
                // ==========================================

                try {
                    const relatedResponse = await api.get(
                        `/papers/${id}/related`
                    );

                    const relatedData =
                        relatedResponse.data?.data ||
                        relatedResponse.data?.papers ||
                        [];

                    if (Array.isArray(relatedData)) {
                        setRelatedPapers(relatedData);
                    }
                } catch (relatedError) {
                    console.error(
                        "Error fetching related papers:",
                        relatedError
                    );
                }

                // ==========================================
                // FETCH REVIEWS
                // ==========================================

                try {
                    const reviewsResponse = await api.get(
                        `/papers/${id}/reviews`
                    );

                    const reviewsData =
                        reviewsResponse.data?.data ||
                        reviewsResponse.data?.reviews ||
                        [];

                    const summaryData =
                        reviewsResponse.data?.summary || {
                            review_count: 0,
                            average_rating: 0,
                        };

                    if (Array.isArray(reviewsData)) {
                        setReviews(reviewsData);
                    }

                    setReviewSummary(summaryData);
                } catch (reviewFetchError) {
                    console.error(
                        "Error fetching reviews:",
                        reviewFetchError
                    );
                }
            } catch (err) {
                console.error("Error fetching paper:", err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load paper."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPaper();
    }, [id]);

    // ==========================================
    // BOOKMARK
    // ==========================================

    const handleBookmark = async () => {
        try {
            setBookmarkLoading(true);

            if (!bookmarked) {
                await api.post(`/papers/${id}/bookmark`);
                setBookmarked(true);
            } else {
                await api.delete(`/papers/${id}/bookmark`);
                setBookmarked(false);
            }
        } catch (err) {
            console.error("Bookmark error:", err);

            if (err.response?.status === 409) {
                setBookmarked(true);
            }
        } finally {
            setBookmarkLoading(false);
        }
    };

    // ==========================================
    // DOWNLOAD
    // ==========================================

    const handleDownload = async () => {
        try {
            setDownloadLoading(true);

            await api.post(`/papers/${id}/download`);

            setDownloadCount(
                (previousCount) => previousCount + 1
            );
        } catch (err) {
            console.error("Download error:", err);
        } finally {
            setDownloadLoading(false);
        }
    };

    // ==========================================
    // SUBMIT REVIEW
    // ==========================================

    const handleReviewSubmit = async (event) => {
        event.preventDefault();

        try {
            setReviewLoading(true);
            setReviewError("");
            setReviewSuccess("");

            const response = await api.post(
                `/papers/${id}/reviews`,
                {
                    rating: Number(reviewRating),
                    comment: reviewText,
                }
            );

            const newReview =
                response.data?.data ||
                response.data;

            setReviews((previousReviews) => [
                newReview,
                ...previousReviews,
            ]);

            setReviewText("");
            setReviewRating(5);

            setReviewSuccess(
                "Review submitted successfully."
            );

            // Refresh review summary
            const reviewsResponse = await api.get(
                `/papers/${id}/reviews`
            );

            const reviewsData =
                reviewsResponse.data?.data ||
                reviewsResponse.data?.reviews ||
                [];

            const summaryData =
                reviewsResponse.data?.summary || {
                    review_count: 0,
                    average_rating: 0,
                };

            if (Array.isArray(reviewsData)) {
                setReviews(reviewsData);
            }

            setReviewSummary(summaryData);
        } catch (err) {
            console.error(
                "Review submission error:",
                err
            );

            if (err.response?.status === 401) {
                setReviewError(
                    "Please log in to submit a review."
                );
            } else if (err.response?.status === 409) {
                setReviewError(
                    "You have already reviewed this paper."
                );
            } else {
                setReviewError(
                    err.response?.data?.message ||
                    "Failed to submit review."
                );
            }
        } finally {
            setReviewLoading(false);
        }
    };

    // ==========================================
    // LOADING STATE
    // ==========================================

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-state">
                    Loading paper...
                </div>
            </div>
        );
    }

    // ==========================================
    // ERROR STATE
    // ==========================================

    if (error) {
        return (
            <div className="page-container">
                <div className="error-state">
                    {error}
                </div>

                <Link
                    to="/discover"
                    className="back-link"
                >
                    ← Back to Discover
                </Link>
            </div>
        );
    }

    // ==========================================
    // PAPER NOT FOUND
    // ==========================================

    if (!paper) {
        return (
            <div className="page-container">
                <div className="empty-state">
                    Paper not found.
                </div>

                <Link
                    to="/discover"
                    className="back-link"
                >
                    ← Back to Discover
                </Link>
            </div>
        );
    }

    return (
        <div className="page-container">

            {/* Back */}
            <Link
                to="/discover"
                className="back-link"
            >
                ← Back to Discover
            </Link>

            <div className="paper-details-card">

                {/* ======================================
                    PAPER HEADER
                ====================================== */}

                <div className="paper-details-header">

                    <div>
                        <span className="paper-type-badge">
                            {paper.paper_type ||
                                "Research Paper"}
                        </span>

                        <h1>{paper.title}</h1>
                    </div>

                    <div className="paper-actions">

                        <button
                            type="button"
                            onClick={handleBookmark}
                            disabled={bookmarkLoading}
                            className="bookmark-button"
                        >
                            {bookmarkLoading
                                ? "Saving..."
                                : bookmarked
                                    ? "🔖 Bookmarked"
                                    : "🔖 Bookmark"}
                        </button>

                        <button
                            type="button"
                            onClick={handleDownload}
                            disabled={downloadLoading}
                            className="download-button"
                        >
                            {downloadLoading
                                ? "Recording..."
                                : "⬇️ Download"}
                        </button>

                    </div>

                </div>

                {/* ======================================
                    PAPER METADATA
                ====================================== */}

                <div className="paper-meta">

                    <span>
                        ⬇️ {downloadCount} downloads
                    </span>

                    {paper.publication_year && (
                        <span>
                            📅 {paper.publication_year}
                        </span>
                    )}

                    {paper.venue_name && (
                        <span>
                            🏛️ {paper.venue_name}
                        </span>
                    )}

                    {paper.doi && (
                        <span>
                            DOI: {paper.doi}
                        </span>
                    )}

                </div>

                {/* ======================================
                    ABSTRACT
                ====================================== */}

                {paper.abstract && (
                    <section className="paper-section">

                        <h2>Abstract</h2>

                        <p>
                            {paper.abstract}
                        </p>

                    </section>
                )}

                {/* ======================================
                    PAPER INFORMATION
                ====================================== */}

                <section className="paper-section">

                    <h2>Paper Information</h2>

                    <div className="paper-info-grid">

                        {paper.research_area_name && (
                            <div>
                                <strong>
                                    Research Area
                                </strong>

                                <span>
                                    {paper.research_area_name}
                                </span>
                            </div>
                        )}

                        {paper.paper_type && (
                            <div>
                                <strong>
                                    Paper Type
                                </strong>

                                <span>
                                    {paper.paper_type}
                                </span>
                            </div>
                        )}

                        {paper.publication_year && (
                            <div>
                                <strong>
                                    Publication Year
                                </strong>

                                <span>
                                    {paper.publication_year}
                                </span>
                            </div>
                        )}

                        {paper.doi && (
                            <div>
                                <strong>
                                    DOI
                                </strong>

                                <span>
                                    {paper.doi}
                                </span>
                            </div>
                        )}

                    </div>

                </section>

                {/* ======================================
                    CITATION NETWORK
                ====================================== */}

                <section className="paper-section">

                    <div className="citation-header">

                        <h2>
                            Citation Network
                        </h2>

                        <div className="citation-stats">

                            <div className="citation-stat">

                                <strong>
                                    {citationStats?.citation_count ??
                                        citationStats?.citations ??
                                        citations.length}
                                </strong>

                                <span>
                                    Citations
                                </span>

                            </div>

                            <div className="citation-stat">

                                <strong>
                                    {citationStats?.cited_by_count ??
                                        citationStats?.cited_by ??
                                        citedBy.length}
                                </strong>

                                <span>
                                    Cited By
                                </span>

                            </div>

                            {impactScore !== null && (
                                <div
                                    className="citation-stat"
                                    title="Application-defined ResearchSphere indicator, not an official academic metric"
                                >
                                    <strong>{impactScore}</strong>
                                    <span>Impact Score</span>
                                </div>
                            )}

                        </div>

                    </div>

                    <div className="citation-columns">

                        {/* Papers This Paper Cites */}

                        <div>

                            <h3>
                                Papers This Paper Cites
                            </h3>

                            {citations.length === 0 ? (
                                <p className="empty-text">
                                    No citation records found.
                                </p>
                            ) : (
                                <div className="citation-list">

                                    {citations.map(
                                        (citation, index) => (
                                            <div
                                                className="citation-card"
                                                key={
                                                    citation.paper_id ||
                                                    citation.cited_paper_id ||
                                                    citation.id ||
                                                    index
                                                }
                                            >

                                                <strong>
                                                    {citation.title ||
                                                        citation.paper_title ||
                                                        `Paper ${
                                                            citation.cited_paper_id ||
                                                            ""
                                                        }`}
                                                </strong>

                                                {citation.publication_year && (
                                                    <span>
                                                        {
                                                            citation.publication_year
                                                        }
                                                    </span>
                                                )}

                                            </div>
                                        )
                                    )}

                                </div>
                            )}

                        </div>

                        {/* Papers Citing This Paper */}

                        <div>

                            <h3>
                                Papers Citing This Paper
                            </h3>

                            {citedBy.length === 0 ? (
                                <p className="empty-text">
                                    No papers currently cite
                                    this paper.
                                </p>
                            ) : (
                                <div className="citation-list">

                                    {citedBy.map(
                                        (citation, index) => (
                                            <div
                                                className="citation-card"
                                                key={
                                                    citation.paper_id ||
                                                    citation.citing_paper_id ||
                                                    citation.id ||
                                                    index
                                                }
                                            >

                                                <strong>
                                                    {citation.title ||
                                                        citation.paper_title ||
                                                        `Paper ${
                                                            citation.citing_paper_id ||
                                                            ""
                                                        }`}
                                                </strong>

                                                {citation.publication_year && (
                                                    <span>
                                                        {
                                                            citation.publication_year
                                                        }
                                                    </span>
                                                )}

                                            </div>
                                        )
                                    )}

                                </div>
                            )}

                        </div>

                    </div>

                </section>

                {/* ======================================
                    RELATED RESEARCH
                ====================================== */}

                <section className="paper-section related-section">

                    <div className="section-header">

                        <h2>
                            Related Research
                        </h2>

                        <p>
                            Discover papers connected through
                            research areas, keywords, and authors.
                        </p>

                    </div>

                    {relatedPapers.length === 0 ? (
                        <p className="empty-text">
                            No related papers found.
                        </p>
                    ) : (
                        <div className="related-grid">

                            {relatedPapers.map(
                                (related) => (
                                    <div
                                        className="related-card"
                                        key={related.paper_id}
                                    >

                                        <span className="paper-type-badge">
                                            {related.paper_type ||
                                                "Research Paper"}
                                        </span>

                                        <h3>
                                            {related.title}
                                        </h3>

                                        <p className="related-meta">
                                            {related.area_name ||
                                                "Research Area"}

                                            {related.publication_year &&
                                                ` • ${related.publication_year}`}
                                        </p>

                                        <div className="related-stats">

                                            <span>
                                                🔑 Shared Keywords:{" "}
                                                {related.shared_keywords}
                                            </span>

                                            <span>
                                                👥 Shared Authors:{" "}
                                                {related.shared_authors}
                                            </span>

                                            <span>
                                                ⭐ Relevance:{" "}
                                                {related.relevance_score}
                                            </span>

                                        </div>

                                        <Link
                                            to={`/papers/${related.paper_id}`}
                                            className="view-paper-button"
                                        >
                                            View Paper →
                                        </Link>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </section>

                {/* ======================================
                    REVIEWS & RATINGS
                ====================================== */}

                <section className="paper-section reviews-section">

                    <div className="section-header">

                        <h2>
                            Reviews & Ratings
                        </h2>

                        <p>
                            See what researchers think about
                            this paper.
                        </p>

                    </div>

                    {/* Rating Summary */}

                    <div className="review-summary">

                        <div className="rating-summary-main">

                            <strong>
                                {Number(
                                    reviewSummary.average_rating || 0
                                ).toFixed(1)}
                            </strong>

                            <div className="rating-stars">
                                {"★".repeat(
                                    Math.round(
                                        Number(
                                            reviewSummary.average_rating ||
                                            0
                                        )
                                    )
                                )}
                            </div>

                            <span>
                                {reviewSummary.review_count || 0}{" "}
                                reviews
                            </span>

                        </div>

                    </div>

                    {/* Add Review */}

                    <div className="review-form-card">

                        <h3>
                            Write a Review
                        </h3>

                        <form
                            onSubmit={handleReviewSubmit}
                        >

                            <label htmlFor="review-rating">
                                Rating
                            </label>

                            <select
                                id="review-rating"
                                value={reviewRating}
                                onChange={(event) =>
                                    setReviewRating(
                                        event.target.value
                                    )
                                }
                                disabled={reviewLoading}
                            >
                                <option value="5">
                                    ★★★★★ — 5
                                </option>

                                <option value="4">
                                    ★★★★☆ — 4
                                </option>

                                <option value="3">
                                    ★★★☆☆ — 3
                                </option>

                                <option value="2">
                                    ★★☆☆☆ — 2
                                </option>

                                <option value="1">
                                    ★☆☆☆☆ — 1
                                </option>
                            </select>

                            <label htmlFor="review-text">
                                Review
                            </label>

                            <textarea
                                id="review-text"
                                value={reviewText}
                                onChange={(event) =>
                                    setReviewText(
                                        event.target.value
                                    )
                                }
                                placeholder="Share your thoughts about this paper..."
                                rows="4"
                                disabled={reviewLoading}
                            />

                            {reviewError && (
                                <p className="review-error">
                                    {reviewError}
                                </p>
                            )}

                            {reviewSuccess && (
                                <p className="review-success">
                                    {reviewSuccess}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="submit-review-button"
                                disabled={reviewLoading}
                            >
                                {reviewLoading
                                    ? "Submitting..."
                                    : "Submit Review"}
                            </button>

                        </form>

                    </div>

                    {/* Existing Reviews */}

                    <div className="reviews-list">

                        <h3>
                            Reader Reviews
                        </h3>

                        {reviews.length === 0 ? (
                            <p className="empty-text">
                                No reviews yet. Be the first
                                to review this paper.
                            </p>
                        ) : (
                            reviews.map((review) => (
                                <div
                                    className="review-card"
                                    key={review.review_id}
                                >

                                    <div className="review-card-header">

                                        <strong>
                                            {review.reviewer_name ||
                                                "Anonymous Researcher"}
                                        </strong>

                                        <span className="review-rating">
                                            {"★".repeat(
                                                Number(
                                                    review.rating
                                                )
                                            )}

                                            {"☆".repeat(
                                                5 -
                                                Number(
                                                    review.rating
                                                )
                                            )}
                                        </span>

                                    </div>

                                    {review.comment && (
                                        <p>
                                            {review.comment}
                                        </p>
                                    )}

                                    {review.created_at && (
                                        <span className="review-date">
                                            {new Date(
                                                review.created_at
                                            ).toLocaleDateString()}
                                        </span>
                                    )}

                                </div>
                            ))
                        )}

                    </div>

                </section>

            </div>

        </div>
    );
}

export default PaperDetails;