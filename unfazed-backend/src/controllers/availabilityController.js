const Availability = require("../models/Availability");

const createAvailability = async (req, res) => {
    try {
        const {
            dayOfWeek,
            startTime,
            endTime,
            sessionDuration,
            bufferTime
        } = req.body;

        const availability = await Availability.create({
            therapist: req.therapistId,
            dayOfWeek,
            startTime,
            endTime,
            sessionDuration,
            bufferTime
        });

        res.status(201).json({
            message: "Availability created successfully",
            availability
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create availability",
            error: error.message
        });
    }
};

const getAvailability = async (req, res) => {
    try {
        const availability = await Availability.find({
            therapist: req.therapistId
        }).sort({ dayOfWeek: 1 });

        res.json({
            availability
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get availability",
            error: error.message
        });
    }
};

const deleteAvailability = async (req, res) => {
    try {
        const availability = await Availability.findOneAndDelete({
            _id: req.params.id,
            therapist: req.therapistId
        });

        if (!availability) {
            return res.status(404).json({
                message: "Availability not found"
            });
        }

        res.json({
            message: "Availability deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete availability",
            error: error.message
        });
    }
};

module.exports = {
    createAvailability,
    getAvailability,
    deleteAvailability
};