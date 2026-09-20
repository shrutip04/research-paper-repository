const express = require("express");
const downloadController = require("../controllers/downloadController");

const router = express.Router();

router.post(
    "/papers/:id/download",
    downloadController.recordDownload
);

router.get(
    "/papers/:id/downloads",
    downloadController.getPaperDownloads
);

module.exports = router;