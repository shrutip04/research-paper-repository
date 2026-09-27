import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import { UploadCloud, FileText, X } from "lucide-react";
import { UploadCloud, FileText, X, Plus } from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Page from "../components/Page";

const PAPER_TYPES = ["RESEARCH", "REVIEW", "SURVEY", "CASE_STUDY", "SHORT_PAPER"];

function SubmitPaper() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [areas, setAreas] = useState([]);
    const [venues, setVenues] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [form, setForm] = useState({
        title: "",
        abstract: "",
        publication_year: new Date().getFullYear(),
        paper_type: "RESEARCH",
        doi: "",
        area_id: "",
        venue_id: "",
    });
    const [file, setFile] = useState(null);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [selectedKeywords, setSelectedKeywords] = useState([]);

    const [newAuthorName, setNewAuthorName] = useState("");
    const [addingAuthor, setAddingAuthor] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const canSubmit = user?.role !== "STUDENT";

    useEffect(() => {
        const load = async () => {
            try {
                const [a, v, au, kw] = await Promise.all([
                    api.get("/areas"),
                    api.get("/venues"),
                    api.get("/authors"),
                    api.get("/keywords"),
                ]);
                setAreas(a.data?.data || []);
                setVenues(v.data?.data || []);
                setAuthors(au.data?.data || []);
                setKeywords(kw.data?.data || []);
            } catch (err) {
                console.error(err);
                setLoadError("Could not load the submission form.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const toggle = (list, setList, id) => {
        setList(
            list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
        );
    };

    const handleAddAuthor = async () => {
    const name = newAuthorName.trim();
    if (!name) return;

    setAddingAuthor(true);
    setError("");

    try {
        const res = await api.post("/authors", { name });
        const newAuthor = res.data?.data;

        setAuthors((prev) => [...prev, newAuthor]);
        setSelectedAuthors((prev) => [...prev, newAuthor.author_id]);
        setNewAuthorName("");
    } catch (err) {
        console.error(err);
        setError(
            err.response?.data?.message || "Could not add that author."
        );
    } finally {
        setAddingAuthor(false);
    }
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.title.trim() || !form.publication_year || !form.area_id) {
            setError("Title, publication year, and research area are required.");
            return;
        }

        if (!file) {
            setError("Please attach the paper as a PDF.");
            return;
        }

        setSubmitting(true);

        try {
            const body = new FormData();
            body.append("title", form.title);
            body.append("abstract", form.abstract);
            body.append("publication_year", form.publication_year);
            body.append("paper_type", form.paper_type);
            if (form.doi) body.append("doi", form.doi);
            body.append("area_id", form.area_id);
            if (form.venue_id) body.append("venue_id", form.venue_id);
            body.append("file", file);

            // Let the browser set the multipart boundary itself -- the
            // api instance defaults to application/json, so it must be
            // explicitly cleared for this one request.
            const res = await api.post("/papers", body, {
                headers: { "Content-Type": undefined },
            });

            const paperId = res.data?.data?.paper_id;

            if (selectedAuthors.length > 0) {
                await api.post(`/papers/${paperId}/authors`, {
                    author_ids: selectedAuthors,
                });
            }

            if (selectedKeywords.length > 0) {
                await api.post(`/papers/${paperId}/keywords`, {
                    keyword_ids: selectedKeywords,
                });
            }

            navigate(`/papers/${paperId}`);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                    "Could not submit the paper. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (!canSubmit) {
        return (
            <Page eyebrow="SUBMIT" title="Submit a Paper">
                <div className="empty-state">
                    Submitting papers requires a Researcher, Faculty, or
                    Admin account. Your current role is {user?.role}.
                </div>
            </Page>
        );
    }

    return (
        <Page
            eyebrow="SUBMIT"
            title="Submit a Paper"
            subtitle="Upload a PDF and describe your paper for the repository."
            loading={loading}
            error={loadError}
        >
            <form className="submit-paper-form" onSubmit={handleSubmit}>
                {error && <div className="error-banner">{error}</div>}

                <label htmlFor="file-upload">Paper PDF</label>
                <label htmlFor="file-upload" className="file-drop">
                    {file ? (
                        <>
                            <FileText size={20} />
                            <span>{file.name}</span>
                            <button
                                type="button"
                                className="file-drop-clear"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setFile(null);
                                }}
                            >
                                <X size={15} />
                            </button>
                        </>
                    ) : (
                        <>
                            <UploadCloud size={22} />
                            <span>Click to choose a PDF file</span>
                        </>
                    )}
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    hidden
                />

                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    className="form-input"
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Paper title"
                />

                <label htmlFor="abstract">Abstract</label>
                <textarea
                    id="abstract"
                    className="form-textarea"
                    rows={4}
                    value={form.abstract}
                    onChange={(e) => setForm({ ...form, abstract: e.target.value })}
                    placeholder="A short summary of the paper..."
                />

                <div className="form-row">
                    <div>
                        <label htmlFor="year">Publication Year</label>
                        <input
                            id="year"
                            className="form-input"
                            type="number"
                            min="1900"
                            max="2100"
                            value={form.publication_year}
                            onChange={(e) =>
                                setForm({ ...form, publication_year: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label htmlFor="paper_type">Paper Type</label>
                        <select
                            id="paper_type"
                            className="form-select"
                            value={form.paper_type}
                            onChange={(e) =>
                                setForm({ ...form, paper_type: e.target.value })
                            }
                        >
                            {PAPER_TYPES.map((t) => (
                                <option key={t} value={t}>{t.replace("_", " ")}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div>
                        <label htmlFor="area">Research Area</label>
                        <select
                            id="area"
                            className="form-select"
                            value={form.area_id}
                            onChange={(e) => setForm({ ...form, area_id: e.target.value })}
                        >
                            <option value="">Select an area...</option>
                            {areas.map((a) => (
                                <option key={a.area_id} value={a.area_id}>
                                    {a.area_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="venue">Publication Venue (optional)</label>
                        <select
                            id="venue"
                            className="form-select"
                            value={form.venue_id}
                            onChange={(e) => setForm({ ...form, venue_id: e.target.value })}
                        >
                            <option value="">None</option>
                            {venues.map((v) => (
                                <option key={v.venue_id} value={v.venue_id}>
                                    {v.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <label htmlFor="doi">DOI (optional)</label>
                <input
                    id="doi"
                    className="form-input"
                    type="text"
                    value={form.doi}
                    onChange={(e) => setForm({ ...form, doi: e.target.value })}
                    placeholder="10.xxxx/xxxxx"
                />

                <label>Authors (optional)</label>
                <div className="chip-row">
                    {authors.map((a) => (
                        <button
                            type="button"
                            key={a.author_id}
                            className={`chip ${selectedAuthors.includes(a.author_id) ? "selected" : ""}`}
                            onClick={() => toggle(selectedAuthors, setSelectedAuthors, a.author_id)}
                        >
                            {a.name}
                        </button>
                    ))}
                </div>

<div className="quick-add-row">
    <input
        type="text"
        className="form-input"
        placeholder="Not listed? Type a name and add them"
        value={newAuthorName}
        onChange={(e) => setNewAuthorName(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleAddAuthor();
            }
        }}
    />
    <button
        type="button"
        className="secondary-button"
        disabled={addingAuthor || !newAuthorName.trim()}
        onClick={handleAddAuthor}
    >
        <Plus size={14} /> Add
    </button>
</div>

                <label>Keywords (optional)</label>
                <div className="chip-row">
                    {keywords.map((k) => (
                        <button
                            type="button"
                            key={k.keyword_id}
                            className={`chip ${selectedKeywords.includes(k.keyword_id) ? "selected" : ""}`}
                            onClick={() => toggle(selectedKeywords, setSelectedKeywords, k.keyword_id)}
                        >
                            {k.keyword_name}
                        </button>
                    ))}
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="primary-button"
                        disabled={submitting}
                    >
                        {submitting ? "Submitting..." : "Submit Paper"}
                    </button>
                </div>
            </form>
        </Page>
    );
}

export default SubmitPaper;