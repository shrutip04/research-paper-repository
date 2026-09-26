import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import SpotlightCard from "../reactbits/SpotlightCard/SpotlightCard";
import { FileSearch, Quote, Download, Star } from "lucide-react";

function Discover() {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [area, setArea] = useState("");
    const [year, setYear] = useState("");
    const [paperType, setPaperType] = useState("");

    const [areas, setAreas] = useState([]);

    const fetchPapers = async () => {
        try {
            setLoading(true);
            setError("");

            const params = {};

            if (search.trim()) params.search = search.trim();
            if (area) params.area = area;
            if (year) params.year = year;
            if (paperType) params.paper_type = paperType;

            const response = await api.get("/papers", { params });

            const data = response.data;

            if (Array.isArray(data)) {
                setPapers(data);
            } else if (Array.isArray(data.data)) {
                setPapers(data.data);
            } else if (Array.isArray(data.papers)) {
                setPapers(data.papers);
            } else if (Array.isArray(data.results)) {
                setPapers(data.results);
            } else {
                setPapers([]);
            }
        } catch (err) {
            console.error("Paper discovery error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load research papers."
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchAreas = async () => {
        try {
            const response = await api.get("/areas");

            const data = response.data;

            if (Array.isArray(data)) {
                setAreas(data);
            } else if (Array.isArray(data.data)) {
                setAreas(data.data);
            } else if (Array.isArray(data.areas)) {
                setAreas(data.areas);
            }
        } catch (err) {
            console.error("Research areas error:", err);
        }
    };

    useEffect(() => {
        fetchAreas();
        fetchPapers();
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();
        fetchPapers();
    };

    const clearFilters = () => {
        setSearch("");
        setArea("");
        setYear("");
        setPaperType("");

        setTimeout(() => {
            fetchPapers();
        }, 0);
    };

    return (
        <div className="discover-page">

            <section className="discover-header">
                <div>
                    <p className="eyebrow">RESEARCH DISCOVERY</p>

                    <h1>Explore Research</h1>

                    <p>
                        Search and discover research papers across
                        different fields, authors, and publication years.
                    </p>
                </div>
            </section>

            <form
                className="search-box"
                onSubmit={handleSearch}
            >
                <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                    placeholder="Search papers, topics, DOI, or keywords..."
                />

                <button type="submit" className="primary-button">
                    Search
                </button>
            </form>

            <section className="filters">

                <div className="filter-group">
                    <label>Research Area</label>

                    <select
                        value={area}
                        onChange={(event) =>
                            setArea(event.target.value)
                        }
                    >
                        <option value="">All Areas</option>

                        {areas.map((item, index) => (
                            <option
                                key={
                                    item.area_id ??
                                    item.id ??
                                    index
                                }
                                value={
                                    item.area_id ??
                                    item.id
                                }
                            >
                                {item.area_name ??
                                    item.name ??
                                    item.research_area}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Publication Year</label>

                    <select
                        value={year}
                        onChange={(event) =>
                            setYear(event.target.value)
                        }
                    >
                        <option value="">All Years</option>
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Paper Type</label>

                    <select
                        value={paperType}
                        onChange={(event) =>
                            setPaperType(event.target.value)
                        }
                    >
                        <option value="">All Types</option>
                        <option value="RESEARCH">Research</option>
                        <option value="REVIEW">Review</option>
                        <option value="CONFERENCE">Conference</option>
                        <option value="JOURNAL">Journal</option>
                    </select>
                </div>

                <button
                    type="button"
                    className="clear-button"
                    onClick={clearFilters}
                >
                    Clear
                </button>

                <button
                    type="button"
                    className="filter-button"
                    onClick={fetchPapers}
                >
                    Apply Filters
                </button>

            </section>

            {error && (
                <div className="error-banner">
                    {error}
                </div>
            )}

            <div className="results-header">
                <div>
                    <h2>Research Papers</h2>
                    <span>
                        {loading
                            ? "Loading..."
                            : `${papers.length} papers found`}
                    </span>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">
                    Loading research papers...
                </div>
            ) : papers.length === 0 ? (
                <div className="empty-discover">
                    <div className="empty-icon"><FileSearch size={32} /></div>
                    <h3>No papers found</h3>
                    <p>
                        Try changing your search or filters.
                    </p>
                </div>
            ) : (
                <div className="paper-results">

                    {papers.map((paper, index) => {

                        const paperId =
                            paper.paper_id ??
                            paper.id;

                        const title =
                            paper.title ??
                            "Untitled Research Paper";

                        const authors =
                            paper.authors ??
                            paper.author_names ??
                            "";

                        const keywords =
                            paper.keywords ??
                            paper.keyword_names ??
                            "";

                        return (
                            <SpotlightCard
                                className="paper-card"
                                spotlightColor="rgba(23, 32, 51, 0.07)"
                                key={paperId ?? index}
                            >

                                <div className="paper-card-content">

                                    <div className="paper-card-top">
                                        <span className="paper-type">
                                            {paper.paper_type ??
                                                paper.type ??
                                                "RESEARCH PAPER"}
                                        </span>

                                        <span className="paper-year">
                                            {paper.publication_year ??
                                                paper.year ??
                                                ""}
                                        </span>
                                    </div>

                                    <h3>{title}</h3>

                                    {authors && (
                                        <p className="paper-authors">
                                            {authors}
                                        </p>
                                    )}

                                    <p className="paper-abstract">
                                        {paper.abstract
                                            ? paper.abstract.length > 240
                                                ? `${paper.abstract.substring(
                                                    0,
                                                    240
                                                )}...`
                                                : paper.abstract
                                            : "No abstract available."}
                                    </p>

                                    <div className="paper-tags">

                                        {(Array.isArray(keywords)
                                            ? keywords
                                            : String(keywords)
                                                .split(",")
                                                .filter(Boolean)
                                        )
                                            .slice(0, 5)
                                            .map((keyword, keywordIndex) => (
                                                <span key={keywordIndex}>
                                                    {typeof keyword ===
                                                    "object"
                                                        ? keyword.name ??
                                                          keyword.keyword_name
                                                        : keyword}
                                                </span>
                                            ))}

                                    </div>

                                    <div className="paper-footer">

                                        <div className="paper-stats">

                                            <span>
                                                <Quote size={13} />
                                                {paper.citations_count ??
                                                    paper.citation_count ??
                                                    paper.citations ??
                                                    0}
                                            </span>

                                            <span>
                                                <Download size={13} />
                                                {paper.downloads_count ??
                                                    paper.download_count ??
                                                    paper.downloads ??
                                                    0}
                                            </span>

                                            <span>
                                                <Star size={13} className="icon-star" />
                                                {paper.average_rating ??
                                                    paper.rating ??
                                                    "—"}
                                            </span>

                                        </div>

                                        {paperId && (
                                            <Link
                                                to={`/papers/${paperId}`}
                                                className="secondary-button"
                                            >
                                                View Paper →
                                            </Link>
                                        )}

                                    </div>

                                </div>

                            </SpotlightCard>
                        );
                    })}

                </div>
            )}

        </div>
    );
}

export default Discover;