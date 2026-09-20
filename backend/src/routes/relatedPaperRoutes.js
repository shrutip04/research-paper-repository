const express = require("express");
const relatedPaperController = require("../controllers/relatedPaperController");

const router = express.Router();

router.get("/:id/related", relatedPaperController.getRelatedPapers);

module.exports = router;