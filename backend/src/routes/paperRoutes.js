const express = require("express");
const paperController = require("../controllers/paperController");

const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", paperController.getAllPapers);

router.get("/search", paperController.searchPapers);

router.get("/:id", paperController.getPaperById);

router.post("/", authenticateToken, authorizeRoles("RESEARCHER", "FACULTY", "ADMIN"), paperController.createPaper);

router.put("/:id", authenticateToken, authorizeRoles("RESEARCHER", "FACULTY", "ADMIN"), paperController.updatePaper);

router.delete("/:id", authenticateToken, authorizeRoles("ADMIN"), paperController.deletePaper);

module.exports = router;