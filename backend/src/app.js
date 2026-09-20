const express = require("express");  //imports Express.
const cors = require("cors");
require("dotenv").config();

const app = express();   //creates our Express application.

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());  //CORS allows the browser to make requests between different domains.
app.use(express.json());  //This allows Express to understand JSON request bodies.

// Health check
app.get("/api/health", (req, res) => {    //It doesn't touch PostgreSQL. It simply confirms that the Express server itself is alive.
    res.status(200).json({  //200 means the request was successfully processed.
        success: true,
        message: "ResearchSphere API is running"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`ResearchSphere API running on http://localhost:${PORT}`);
});