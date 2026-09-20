const paperService = require("../services/paperService");

const getAllPapers = async (req, res) => {
    try {
        const papers = await paperService.getAllPapers();

        res.status(200).json({
            success: true,
            count: papers.length,
            data: papers
        });
    } catch (error) {
        console.error("Error fetching papers:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch papers"
        });
    }
};

const getPaperById = async (req, res) => {
    try {
        const paperId = Number(req.params.id);

        if (!Number.isInteger(paperId) || paperId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid paper ID"
            });
        }

        const paper = await paperService.getPaperById(paperId);

        if (!paper) {
            return res.status(404).json({
                success: false,
                message: "Paper not found"
            });
        }

        res.status(200).json({
            success: true,
            data: paper
        });
    } catch (error) {
        console.error("Error fetching paper:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch paper"
        });
    }
};

const searchPapers = async (req, res) => {
    try {
        const searchTerm = req.query.q;

        if (!searchTerm || searchTerm.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Search term is required"
            });
        }

        const papers = await paperService.searchPapers(searchTerm.trim());

        res.status(200).json({
            success: true,
            count: papers.length,
            data: papers
        });
    } catch (error) {
        console.error("Error searching papers:", error);

        res.status(500).json({
            success: false,
            message: "Failed to search papers"
        });
    }
};


module.exports = {
    getAllPapers,
    getPaperById,
    searchPapers
};