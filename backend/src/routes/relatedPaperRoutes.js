const express = require("express");
const relatedPaperController = require("../controllers/relatedPaperController");

const analyticsController = require("../controllers/analyticsController");

const router = express.Router();

router.get("/:id/related", relatedPaperController.getRelatedPapers);

// Impact indicator (also reachable at /api/impact/:id/impact)
router.get("/:id/impact", analyticsController.getPaperImpact);

module.exports = router;