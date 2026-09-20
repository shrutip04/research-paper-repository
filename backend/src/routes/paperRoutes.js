const express = require("express");
const paperController = require("../controllers/paperController");

const router = express.Router();

router.get("/", paperController.getAllPapers);

router.get("/:id", paperController.getPaperById);

module.exports = router;