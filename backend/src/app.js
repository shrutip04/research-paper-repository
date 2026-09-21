const authorRoutes = require("./routes/authorRoutes");
const express = require("express");
const cors = require("cors");
const paperRoutes = require("./routes/paperRoutes");
const areaRoutes = require("./routes/areaRoutes");
const keywordRoutes = require("./routes/keywordRoutes");
const citationRoutes = require("./routes/citationRoutes");
const relatedPaperRoutes = require("./routes/relatedPaperRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const downloadRoutes = require("./routes/downloadRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const impactRoutes = require("./routes/impactRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
require("dotenv").config();

const pool = require("./config/db");
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/papers", paperRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/keywords", keywordRoutes);
app.use("/api/papers", citationRoutes);
app.use("/api/papers", relatedPaperRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api", bookmarkRoutes);
app.use("/api", downloadRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/impact", impactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);


// Express health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "ResearchSphere API is running"
    });
});

// PostgreSQL health check
app.get("/api/health/db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW() AS current_time");

        res.status(200).json({
            success: true,
            message: "PostgreSQL connection is working",
            database: "research_repository",
            currentTime: result.rows[0].current_time
        });
    } catch (error) {
        console.error("Database connection error:", error);

        res.status(500).json({
            success: false,
            message: "PostgreSQL connection failed"
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`ResearchSphere API running on http://localhost:${PORT}`);
});