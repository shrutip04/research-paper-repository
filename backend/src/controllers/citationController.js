const citationService = require("../services/citationService");

const getPaperCitations = async (req, res) => {
    try {
        const paperId = Number(req.params.id);

        if (!Number.isInteger(paperId) || paperId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid paper ID"
            });
        }

        const citations = await citationService.getPaperCitations(paperId);

        res.status(200).json({
            success: true,
            paperId,
            count: citations.length,
            data: citations
        });
    } catch (error) {
        console.error("Error fetching paper citations:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch paper citations"
        });
    }
};

const getPaperCitedBy = async (req, res) => {
    try {
        const paperId = Number(req.params.id);

        if (!Number.isInteger(paperId) || paperId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid paper ID"
            });
        }

        const citedBy = await citationService.getPaperCitedBy(paperId);

        res.status(200).json({
            success: true,
            paperId,
            count: citedBy.length,
            data: citedBy
        });
    } catch (error) {
        console.error("Error fetching papers citing this paper:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch papers citing this paper"
        });
    }
};

const getCitationStats = async (req, res) => {
    try {
        const paperId = Number(req.params.id);

        if (!Number.isInteger(paperId) || paperId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid paper ID"
            });
        }

        const stats = await citationService.getCitationStats(paperId);

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error("Error fetching citation statistics:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch citation statistics"
        });
    }
};

module.exports = {
    getPaperCitations,
    getPaperCitedBy,
    getCitationStats
};