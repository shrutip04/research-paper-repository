const downloadService = require("../services/downloadService");

const recordDownload = async (req, res) => {
    try {
        const paperId = Number(req.params.id);
        const userId = Number(req.body.user_id);

        if (!Number.isInteger(paperId) || paperId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid paper ID"
            });
        }

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid user_id is required"
            });
        }

        const download = await downloadService.recordDownload(
            userId,
            paperId
        );

        res.status(201).json({
            success: true,
            message: "Download recorded successfully",
            data: download
        });
    } catch (error) {
        console.error("Error recording download:", error);

        if (error.code === "23503") {
            return res.status(400).json({
                success: false,
                message: "Invalid user or paper"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to record download"
        });
    }
};

const getPaperDownloads = async (req, res) => {
    try {
        const paperId = Number(req.params.id);

        if (!Number.isInteger(paperId) || paperId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid paper ID"
            });
        }

        const downloads = await downloadService.getPaperDownloads(
            paperId
        );

        const summary = await downloadService.getPaperDownloadCount(
            paperId
        );

        res.status(200).json({
            success: true,
            paperId,
            summary,
            count: downloads.length,
            data: downloads
        });
    } catch (error) {
        console.error("Error fetching downloads:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch paper downloads"
        });
    }
};

module.exports = {
    recordDownload,
    getPaperDownloads
};