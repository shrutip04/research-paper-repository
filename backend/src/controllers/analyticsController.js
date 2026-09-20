const analyticsService = require("../services/analyticsService");

const getPaperAnalytics = async (req, res) => {
    try {
        const data = await analyticsService.getPaperAnalytics();

        res.status(200).json({
            success: true,
            count: data.length,
            data
        });
    } catch (error) {
        console.error("Error fetching paper analytics:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch paper analytics"
        });
    }
};

const getAuthorAnalytics = async (req, res) => {
    try {
        const data = await analyticsService.getAuthorAnalytics();

        res.status(200).json({
            success: true,
            count: data.length,
            data
        });
    } catch (error) {
        console.error("Error fetching author analytics:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch author analytics"
        });
    }
};

const getAreaAnalytics = async (req, res) => {
    try {
        const data = await analyticsService.getAreaAnalytics();

        res.status(200).json({
            success: true,
            count: data.length,
            data
        });
    } catch (error) {
        console.error("Error fetching area analytics:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch research area analytics"
        });
    }
};

const getPaperDiscoveryAnalytics = async (req, res) => {
    try {
        const data = await analyticsService.getPaperDiscoveryAnalytics();

        res.status(200).json({
            success: true,
            count: data.length,
            data
        });
    } catch (error) {
        console.error(
            "Error fetching paper discovery analytics:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch paper discovery analytics"
        });
    }
};

const getResearchTrends = async (req, res) => {
    try {
        const data = await analyticsService.getResearchTrends();

        res.status(200).json({
            success: true,
            count: data.length,
            data
        });
    } catch (error) {
        console.error("Error fetching research trends:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch research trends"
        });
    }
};

const getPaperImpact = async (req, res) => {
    try {
        const paperId = Number(req.params.id);

        if (!Number.isInteger(paperId) || paperId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid paper ID"
            });
        }

        const data = await analyticsService.getPaperImpact(paperId);

        res.status(200).json({
            success: true,
            paperId,
            data
        });
    } catch (error) {
        console.error("Error calculating paper impact:", error);

        res.status(500).json({
            success: false,
            message: "Failed to calculate paper impact"
        });
    }
};

module.exports = {
    getPaperAnalytics,
    getAuthorAnalytics,
    getAreaAnalytics,
    getPaperDiscoveryAnalytics,
    getResearchTrends,
    getPaperImpact
};