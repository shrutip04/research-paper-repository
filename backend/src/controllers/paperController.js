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

const createPaper = async (req, res) => {
    try {
        const {
            title,
            abstract,
            publication_year,
            doi,
            paper_type,
            file_url,
            area_id,
            venue_id,
            uploaded_by
        } = req.body;

        if (
            !title ||
            !publication_year ||
            !area_id ||
            !uploaded_by
        ) {
            return res.status(400).json({
                success: false,
                message: "title, publication_year, area_id and uploaded_by are required"
            });
        }

        const paper = await paperService.createPaper({
            title,
            abstract,
            publication_year,
            doi,
            paper_type,
            file_url,
            area_id,
            venue_id,
            uploaded_by
        });

        res.status(201).json({
            success: true,
            message: "Paper created successfully",
            data: paper
        });
    } catch (error) {
        console.error("Error creating paper:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "A paper with this DOI already exists"
            });
        }

        if (error.code === "23503") {
            return res.status(400).json({
                success: false,
                message: "Invalid research area, venue, or uploader"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create paper"
        });
    }
};

module.exports = {
    getAllPapers,
    getPaperById,
    searchPapers,
    createPaper
};