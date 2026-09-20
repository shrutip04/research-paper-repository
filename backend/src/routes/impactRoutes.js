const express = require("express");
const analyticsController = require("../controllers/analyticsController");

const router = express.Router();

router.get("/:id/impact", analyticsController.getPaperImpact);

module.exports = router;