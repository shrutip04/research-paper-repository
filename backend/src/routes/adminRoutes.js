const express = require("express");

const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const adminController = require("../controllers/adminController");

const router = express.Router();

// Every admin route requires a valid JWT AND the ADMIN role
router.use(authenticateToken, authorizeRoles("ADMIN"));

router.get(
    "/dashboard",
    authenticateToken,
    authorizeRoles("ADMIN"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Admin dashboard access granted",
            user: req.user
        });
    }
);

router.get("/stats", adminController.getStats);

router.get("/users", adminController.getUsers);

router.get("/audit-logs", adminController.getAuditLogs);

module.exports = router;