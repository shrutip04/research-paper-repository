const express = require("express");
const keywordController = require("../controllers/keywordController");

const router = express.Router();

router.get("/", keywordController.getAllKeywords);
router.get("/:id/papers", keywordController.getKeywordPapers);

module.exports = router;