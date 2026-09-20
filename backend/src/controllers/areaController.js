const areaService = require("../services/areaService");

const getAllAreas = async (req, res) => {
    try {
        const areas = await areaService.getAllAreas();

        res.status(200).json({
            success: true,
            count: areas.length,
            data: areas
        });
    } catch (error) {
        console.error("Error fetching research areas:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch research areas"
        });
    }
};

const getAreaPapers = async (req, res) => {
    try {
        const areaId = Number(req.params.id);

        if (!Number.isInteger(areaId) || areaId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid research area ID"
            });
        }

        const papers = await areaService.getAreaPapers(areaId);

        res.status(200).json({
            success: true,
            areaId,
            count: papers.length,
            data: papers
        });
    } catch (error) {
        console.error("Error fetching area papers:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch papers for research area"
        });
    }
};

module.exports = {
    getAllAreas,
    getAreaPapers
};