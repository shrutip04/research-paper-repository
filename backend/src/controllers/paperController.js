const paperService = require("../services/paperService");

const getAllPapers = async (req, res) => {
    try {
        const { area, year, paper_type } = req.query;

        const filters = {};

        if (area !== undefined) {
            const areaId = Number(area);

            if (!Number.isInteger(areaId) || areaId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid area parameter"
                });
            }

            filters.area = areaId;
        }

        if (year !== undefined) {
            const publicationYear = Number(year);

            if (
                !Number.isInteger(publicationYear) ||
                publicationYear < 1900 ||
                publicationYear > 2100
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid year parameter"
                });
            }

            filters.year = publicationYear;
        }

        if (paper_type !== undefined) {
            const validPaperTypes = [
                "RESEARCH",
                "REVIEW",
                "SURVEY",
                "CASE_STUDY",
                "SHORT_PAPER"
            ];

            if (!validPaperTypes.includes(paper_type)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid paper_type"
                });
            }

            filters.paper_type = paper_type;
        }

        const papers = await paperService.getAllPapers(filters);

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