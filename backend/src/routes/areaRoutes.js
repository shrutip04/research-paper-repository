const express = require("express");
const areaController = require("../controllers/areaController");

const router = express.Router();

router.get("/", areaController.getAllAreas);
router.get("/:id/papers", areaController.getAreaPapers);

module.exports = router;