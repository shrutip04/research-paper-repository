const express = require("express");
const citationController = require("../controllers/citationController");

const router = express.Router();

router.get("/:id/citations", citationController.getPaperCitations);
router.get("/:id/cited-by", citationController.getPaperCitedBy);
router.get("/:id/citation-stats", citationController.getCitationStats);

module.exports = router;