const express = require("express");
const bookmarkController = require("../controllers/bookmarkController");

const router = express.Router();

router.get(
    "/users/:id/bookmarks",
    bookmarkController.getUserBookmarks
);

router.post(
    "/papers/:id/bookmark",
    bookmarkController.createBookmark
);

router.delete(
    "/papers/:id/bookmark",
    bookmarkController.deleteBookmark
);

module.exports = router;