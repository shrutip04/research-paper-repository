const authorService = require("../services/authorService");

const getAllAuthors = async (req, res) => {
    try {
        const authors = await authorService.getAllAuthors();

        res.status(200).json({
            success: true,
            count: authors.length,
            data: authors
        });
    } catch (error) {
        console.error("Error fetching authors:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch authors"
        });
    }
};

const getAuthorById = async (req, res) => {
    try {
        const authorId = Number(req.params.id);

        if (!Number.isInteger(authorId) || authorId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid author ID"
            });
        }

        const author = await authorService.getAuthorById(authorId);

        if (!author) {
            return res.status(404).json({
                success: false,
                message: "Author not found"
            });
        }

        res.status(200).json({
            success: true,
            data: author
        });
    } catch (error) {
        console.error("Error fetching author:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch author"
        });
    }
};

const getAuthorPapers = async (req, res) => {
    try {
        const authorId = Number(req.params.id);

        if (!Number.isInteger(authorId) || authorId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid author ID"
            });
        }

        const papers = await authorService.getAuthorPapers(authorId);

        res.status(200).json({
            success: true,
            count: papers.length,
            data: papers
        });
    } catch (error) {
        console.error("Error fetching author's papers:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch author's papers"
        });
    }
};

const getAuthorCollaborations = async (req, res) => {
    try {
        const authorId = Number(req.params.id);

        if (!Number.isInteger(authorId) || authorId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid author ID"
            });
        }

        const collaborations =
            await authorService.getAuthorCollaborations(authorId);

        res.status(200).json({
            success: true,
            count: collaborations.length,
            data: collaborations
        });
    } catch (error) {
        console.error("Error fetching collaborations:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch collaborations"
        });
    }
};

module.exports = {
    getAllAuthors,
    getAuthorById,
    getAuthorPapers,
    getAuthorCollaborations
};