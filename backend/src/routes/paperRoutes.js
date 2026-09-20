const express = require("express");
const paperController = require("../controllers/paperController");

const router = express.Router();

router.get("/", paperController.getAllPapers);

router.get("/search", paperController.searchPapers);

router.get("/:id", paperController.getPaperById);

router.post("/", paperController.createPaper);

router.put("/:id", paperController.updatePaper);

module.exports = router;