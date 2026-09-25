const bookmarkService = require("../services/bookmarkService");

const getUserBookmarks = async (req, res) => {
    try {
        const userId = Number(req.params.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        // Users may only read their own bookmarks (ADMIN may read any)
        if (req.user.user_id !== userId && req.user.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "You can only view your own bookmarks"
            });
        }

        const bookmarks = await bookmarkService.getUserBookmarks(userId);

        res.status(200).json({
            success: true,
            userId,
            count: bookmarks.length,
            data: bookmarks
        });
    } catch (error) {
        console.error("Error fetching user bookmarks:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch bookmarks"
        });
    }
};


const createBookmark = async (req, res) => {
    try {
        const paperId = Number(req.params.id);

        // Get user from verified JWT
        const userId = req.user.user_id;

        if (!Number.isInteger(paperId) || paperId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid paper ID"
            });
        }

        const bookmark = await bookmarkService.createBookmark(
            userId,
            paperId
        );

        res.status(201).json({
            success: true,
            message: "Paper bookmarked successfully",
            data: bookmark
        });
    } catch (error) {
        console.error("Error creating bookmark:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "Paper is already bookmarked by this user"
            });
        }

        if (error.code === "23503") {
            return res.status(400).json({
                success: false,
                message: "Invalid user or paper"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to bookmark paper"
        });
    }
};


const deleteBookmark = async (req, res) => {
    try {
        const paperId = Number(req.params.id);

        // Get user from verified JWT
        const userId = req.user.user_id;

        if (!Number.isInteger(paperId) || paperId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid paper ID"
            });
        }

        const bookmark = await bookmarkService.deleteBookmark(
            userId,
            paperId
        );

        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: "Bookmark not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Bookmark removed successfully",
            data: bookmark
        });
    } catch (error) {
        console.error("Error deleting bookmark:", error);

        res.status(500).json({
            success: false,
            message: "Failed to remove bookmark"
        });
    }
};


module.exports = {
    getUserBookmarks,
    createBookmark,
    deleteBookmark
};