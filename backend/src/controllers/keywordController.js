const keywordService = require("../services/keywordService");

const getAllKeywords = async (req, res) => {
    try {
        const keywords = await keywordService.getAllKeywords();

        res.status(200).json({
            success: true,
            count: keywords.length,
            data: keywords
        });
    } catch (error) {
        console.error("Error fetching keywords:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch keywords"
        });
    }
};

const getKeywordPapers = async (req, res) => {
    try {
        const keywordId = Number(req.params.id);

        if (!Number.isInteger(keywordId) || keywordId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid keyword ID"
            });
        }

        const papers = await keywordService.getKeywordPapers(keywordId);

        res.status(200).json({
            success: true,
            keywordId,
            count: papers.length,
            data: papers
        });
    } catch (error) {
        console.error("Error fetching keyword papers:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch papers for keyword"
        });
    }
};

module.exports = {
    getAllKeywords,
    getKeywordPapers
};