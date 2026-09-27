const express = require("express");
const authorController = require("../controllers/authorController");

const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", authorController.getAllAuthors);

router.get("/:id/papers", authorController.getAuthorPapers);

router.get("/:id/collaborations", authorController.getAuthorCollaborations);

router.get("/:id", authorController.getAuthorById);

router.post(
    "/",
    authenticateToken,
    authorizeRoles("RESEARCHER", "FACULTY", "ADMIN"),
    authorController.createAuthor
);

module.exports = router;