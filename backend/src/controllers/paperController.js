const paperService = require("../services/paperService");

const authorService = require("../services/authorService");
const keywordService = require("../services/keywordService");

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
            venue_id
        } = req.body;

        // Uploader always comes from the verified JWT, never the request body
        const uploaded_by = req.user.user_id;

        if (
            !title ||
            !publication_year ||
            !area_id
        ) {
            return res.status(400).json({
                success: false,
                message: "title, publication_year and area_id are required"
            });
        }

                // multer (multipart form) puts the uploaded PDF on req.file and
        // parses every other field as a string -- coerce the numeric ones.
        // If no file was attached, fall back to a plain file_url string
        // (kept for API/Postman testing without a real upload).
        const resolvedFileUrl = req.file
            ? `/uploads/papers/${req.file.filename}`
            : (file_url || null);

        const paper = await paperService.createPaper({
            title,
            abstract,
            publication_year: Number(publication_year),
            doi,
            paper_type,
            file_url: resolvedFileUrl,
            area_id: Number(area_id),
            venue_id: venue_id ? Number(venue_id) : null,
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

const updatePaper = async (req, res) => {
    try {
        const paperId = Number(req.params.id);

        if (!Number.isInteger(paperId) || paperId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid paper ID"
            });
        }

        const {
            title,
            abstract,
            publication_year,
            doi,
            paper_type,
            file_url,
            area_id,
            venue_id
        } = req.body;

        if (!title || !publication_year || !area_id) {
            return res.status(400).json({
                success: false,
                message: "title, publication_year and area_id are required"
            });
        }

        // Only the uploader or an ADMIN may edit a paper
        const existing = await paperService.getPaperById(paperId);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Paper not found"
            });
        }

        if (
            req.user.role !== "ADMIN" &&
            existing.uploaded_by !== req.user.user_id
        ) {
            return res.status(403).json({
                success: false,
                message: "You can only edit papers you uploaded"
            });
        }

        const paper = await paperService.updatePaper(paperId, {
            title,
            abstract,
            publication_year,
            doi,
            paper_type,
            file_url,
            area_id,
            venue_id
        });

        if (!paper) {
            return res.status(404).json({
                success: false,
                message: "Paper not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Paper updated successfully",
            data: paper
        });
    } catch (error) {
        console.error("Error updating paper:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "A paper with this DOI already exists"
            });
        }

        if (error.code === "23503") {
            return res.status(400).json({
                success: false,
                message: "Invalid research area or venue"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to update paper"
        });
    }
};

const deletePaper = async (req, res) => {
    try {
        const paperId = Number(req.params.id);

        if (!Number.isInteger(paperId) || paperId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid paper ID"
            });
        }

        const deletedPaper = await paperService.deletePaper(paperId);

        if (!deletedPaper) {
            return res.status(404).json({
                success: false,
                message: "Paper not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Paper deleted successfully",
            data: deletedPaper
        });
    } catch (error) {
        console.error("Error deleting paper:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete paper"
        });
    }
};

// ==========================================
// ATTACH AUTHORS TO A PAPER
// (only the uploader or an ADMIN)
// ==========================================

const attachAuthors = async (req, res) => {
    try {
        const paperId = Number(req.params.id);

        if (!Number.isInteger(paperId) || paperId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid paper ID"
            });
        }

        const { author_ids } = req.body;

        if (!Array.isArray(author_ids) || author_ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "author_ids must be a non-empty array"
            });
        }

        const paper = await paperService.getPaperById(paperId);

        if (!paper) {
            return res.status(404).json({
                success: false,
                message: "Paper not found"
            });
        }

        if (
            req.user.role !== "ADMIN" &&
            paper.uploaded_by !== req.user.user_id
        ) {
            return res.status(403).json({
                success: false,
                message: "You can only edit papers you uploaded"
            });
        }

        const authorIds = author_ids.map(Number);
        const attached = await authorService.addPaperAuthors(
            paperId,
            authorIds
        );

        res.status(201).json({
            success: true,
            message: "Authors attached to paper",
            data: attached
        });
    } catch (error) {
        console.error("Error attaching authors:", error);

        if (error.code === "23503") {
            return res.status(400).json({
                success: false,
                message: "One or more author_ids do not exist"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to attach authors"
        });
    }
};


// ==========================================
// ATTACH KEYWORDS TO A PAPER
// (only the uploader or an ADMIN)
// ==========================================

const attachKeywords = async (req, res) => {
    try {
        const paperId = Number(req.params.id);

        if (!Number.isInteger(paperId) || paperId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid paper ID"
            });
        }

        const { keyword_ids } = req.body;

        if (!Array.isArray(keyword_ids) || keyword_ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "keyword_ids must be a non-empty array"
            });
        }

        const paper = await paperService.getPaperById(paperId);

        if (!paper) {
            return res.status(404).json({
                success: false,
                message: "Paper not found"
            });
        }

        if (
            req.user.role !== "ADMIN" &&
            paper.uploaded_by !== req.user.user_id
        ) {
            return res.status(403).json({
                success: false,
                message: "You can only edit papers you uploaded"
            });
        }

        const keywordIds = keyword_ids.map(Number);
        const attached = await keywordService.addPaperKeywords(
            paperId,
            keywordIds
        );

        res.status(201).json({
            success: true,
            message: "Keywords attached to paper",
            data: attached
        });
    } catch (error) {
        console.error("Error attaching keywords:", error);

        if (error.code === "23503") {
            return res.status(400).json({
                success: false,
                message: "One or more keyword_ids do not exist"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to attach keywords"
        });
    }
};

module.exports = {
    getAllPapers,
    getPaperById,
    searchPapers,
    createPaper,
    updatePaper,
    deletePaper,
    attachAuthors,
    attachKeywords
};