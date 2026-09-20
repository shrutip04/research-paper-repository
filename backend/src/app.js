const express = require("express");
const cors = require("cors");
const paperRoutes = require("./routes/paperRoutes");
require("dotenv").config();

const pool = require("./config/db");
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/papers", paperRoutes);

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