const express = require("express");
const analyticsController = require("../controllers/analyticsController");

const router = express.Router();

router.get("/papers", analyticsController.getPaperAnalytics);

router.get("/authors", analyticsController.getAuthorAnalytics);

router.get("/areas", analyticsController.getAreaAnalytics);

router.get(
    "/paper-discovery",
    analyticsController.getPaperDiscoveryAnalytics
);

router.get("/trends", analyticsController.getResearchTrends);

module.exports = router;