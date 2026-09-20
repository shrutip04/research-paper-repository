const express = require("express");

const downloadController = require("../controllers/downloadController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Login required to record a download
router.post(
    "/papers/:id/download",
    authenticateToken,
    downloadController.recordDownload
);

// Download statistics can be viewed publicly
router.get(
    "/papers/:id/downloads",
    downloadController.getPaperDownloads
);

module.exports = router;