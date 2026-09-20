const express = require("express");
const paperController = require("../controllers/paperController");

const router = express.Router();

router.get("/", paperController.getAllPapers);

module.exports = router;