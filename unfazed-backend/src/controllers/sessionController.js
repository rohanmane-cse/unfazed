const Session = require("../models/Session");

// ========================================
// CREATE SESSION
// ========================================

const createSession = async (req, res) => {
    try {
        const {
            client,
            date,
            startTime,
            endTime,
            duration
        } = req.body;

        if (
            !client ||
            !date ||
            !startTime ||
            !endTime ||
            !duration
        ) {
            return res.status(400).json({
                message: "Client, date, start time, end time and duration are required"
            });
        }

        // Check for overlapping session
        const existingSession = await Session.findOne({
            therapist: req.therapistId,
            date: new Date(date),
            status: { $ne: "cancelled" },
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
        });

        if (existingSession) {
            return res.status(409).json({
                message: "This time slot is already booked"
            });
        }

        const session = await Session.create({
            therapist: req.therapistId,
            client,
            date,
            startTime,
            endTime,
            duration
        });

        res.status(201).json({
            message: "Session booked successfully",
            session
        });

    } catch (error) {
        console.error("Create session error:", error);

        res.status(500).json({
            message: "Failed to book session",
            error: error.message
        });
    }
};


// ========================================
// GET ALL SESSIONS
// ========================================

const getSessions = async (req, res) => {
    try {
        const sessions = await Session.find({
            therapist: req.therapistId
        })
            .populate("client", "name email")
            .sort({
                date: 1,
                startTime: 1
            });

        res.status(200).json({
            sessions
        });

    } catch (error) {
        console.error("Get sessions error:", error);

        res.status(500).json({
            message: "Failed to get sessions",
            error: error.message
        });
    }
};


module.exports = {
    createSession,
    getSessions
};