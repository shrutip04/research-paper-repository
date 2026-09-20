const relatedPaperService = require("../services/relatedPaperService");

const getRelatedPapers = async (req, res) => {
    try {
        const paperId = Number(req.params.id);

        if (!Number.isInteger(paperId) || paperId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid paper ID"
            });
        }

        const papers = await relatedPaperService.getRelatedPapers(paperId);

        res.status(200).json({
            success: true,
            paperId,
            count: papers.length,
            data: papers
        });
    } catch (error) {
        console.error("Error finding related papers:", error);

        res.status(500).json({
            success: false,
            message: "Failed to find related papers"
        });
    }
};

module.exports = {
    getRelatedPapers
};