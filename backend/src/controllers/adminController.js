const adminService = require("../services/adminService");


const wrap = (label, fn) => async (req, res) => {
    try {
        const data = await fn(req);

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error(`Error fetching admin ${label}:`, error);

        res.status(500).json({
            success: false,
            message: `Failed to fetch admin ${label}`
        });
    }
};


const getStats = wrap("statistics", () => adminService.getStats());

const getUsers = wrap("users", () => adminService.getUsers());

const getAuditLogs = wrap("audit logs", (req) => {
    const requested = Number(req.query.limit);
    const limit =
        Number.isInteger(requested) && requested > 0
            ? Math.min(requested, 200)
            : 50;

    return adminService.getAuditLogs(limit);
});


module.exports = {
    getStats,
    getUsers,
    getAuditLogs
};
