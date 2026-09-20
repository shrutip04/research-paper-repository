const express = require("express");
const authorController = require("../controllers/authorController");

const router = express.Router();

router.get("/", authorController.getAllAuthors);

router.get("/:id/papers", authorController.getAuthorPapers);

router.get("/:id/collaborations", authorController.getAuthorCollaborations);

router.get("/:id", authorController.getAuthorById);

module.exports = router;