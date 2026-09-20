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

module.exports = {
    getAllPapers
};