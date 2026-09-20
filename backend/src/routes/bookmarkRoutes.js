const express = require("express");

const bookmarkController = require("../controllers/bookmarkController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Login required to view personal bookmarks
router.get(
    "/users/:id/bookmarks",
    authenticateToken,
    bookmarkController.getUserBookmarks
);

// Login required to bookmark
router.post(
    "/papers/:id/bookmark",
    authenticateToken,
    bookmarkController.createBookmark
);

// Login required to remove bookmark
router.delete(
    "/papers/:id/bookmark",
    authenticateToken,
    bookmarkController.deleteBookmark
);

module.exports = router;