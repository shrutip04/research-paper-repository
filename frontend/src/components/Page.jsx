// Shared page shell: header + loading / error / empty handling.
function Page({ eyebrow, title, subtitle, loading, error, children }) {
    return (
        <div className="dashboard-page">
            <div className="section-header">
                {eyebrow && <p className="eyebrow">{eyebrow}</p>}
                <h1>{title}</h1>
                {subtitle && <p className="hero-subtitle">{subtitle}</p>}
            </div>

            {error && <div className="error-banner">{error}</div>}

            {loading ? (
                <div className="loading-state">Loading...</div>
            ) : (
                children
            )}
        </div>
    );
}

export default Page;
