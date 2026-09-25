// Dependency-free horizontal bar chart: rows = [{ label, value }]
function BarList({ rows, unit = "" }) {
    const max = Math.max(1, ...rows.map((row) => Number(row.value) || 0));

    if (rows.length === 0) {
        return <div className="empty-state">No data available.</div>;
    }

    return (
        <div className="bar-list">
            {rows.map((row) => (
                <div className="bar-row" key={row.label}>
                    <span className="bar-label">{row.label}</span>
                    <div className="bar-track">
                        <div
                            className="bar-fill"
                            style={{
                                width: `${((Number(row.value) || 0) / max) * 100}%`,
                            }}
                        />
                    </div>
                    <span className="bar-value">
                        {row.value}
                        {unit}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default BarList;
