const multer = require("multer");
const path = require("path");

// Stores uploaded paper PDFs on disk under backend/uploads/papers.
// Served back to the frontend as static files at /uploads/papers/<filename>
// (see app.js), and papers.file_url is set to that path on creation.

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "..", "uploads", "papers"));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");

        cb(null, `${uniqueSuffix}-${safeName}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed"));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024, // 20 MB
    },
});

module.exports = upload;