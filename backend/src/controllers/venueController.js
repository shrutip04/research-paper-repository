const venueService = require("../services/venueService");


const getAllVenues = async (req, res) => {
    try {
        const venues = await venueService.getAllVenues();

        res.status(200).json({
            success: true,
            count: venues.length,
            data: venues
        });
    } catch (error) {
        console.error("Error fetching venues:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch publication venues"
        });
    }
};


module.exports = {
    getAllVenues
};