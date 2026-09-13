const SessionNote = require("../models/SessionNote");
const Session = require("../models/Session");
const Client = require("../models/Client");

// ===============================
// CREATE SESSION NOTE
// ===============================

const createNote = async (req, res) => {
    try {
        const {
            client,
            session,
            content,
            visibility
        } = req.body;

        if (!client || !session || !content) {
            return res.status(400).json({
                message: "Client, session and content are required"
            });
        }

        const sessionData = await Session.findOne({
            _id: session,
            therapist: req.therapistId,
            client: client
        });

        if (!sessionData) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        const clientData = await Client.findOne({
            _id: client,
            therapist: req.therapistId
        });

        if (!clientData) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        const note = await SessionNote.create({
            therapist: req.therapistId,
            client,
            session,
            content,
            visibility: visibility || "private"
        });

        res.status(201).json({
            message: "Session note created successfully",
            note
        });

    } catch (error) {
        console.error("Create note error:", error);

        res.status(500).json({
            message: "Failed to create session note",
            error: error.message
        });
    }
};


// ===============================
// GET ALL SESSION NOTES
// ===============================

const getNotes = async (req, res) => {
    try {
        const notes = await SessionNote.find({
            therapist: req.therapistId
        })
            .populate("client", "name email")
            .populate(
                "session",
                "date startTime endTime duration status"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            notes
        });

    } catch (error) {
        console.error("Get notes error:", error);

        res.status(500).json({
            message: "Failed to get session notes",
            error: error.message
        });
    }
};


// ===============================
// GET NOTES FOR ONE CLIENT
// ===============================

const getClientNotes = async (req, res) => {
    try {
        const clientId = req.params.clientId;

        const client = await Client.findOne({
            _id: clientId,
            therapist: req.therapistId
        });

        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        const notes = await SessionNote.find({
            therapist: req.therapistId,
            client: clientId
        })
            .populate(
                "session",
                "date startTime endTime duration status"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            notes
        });

    } catch (error) {
        console.error("Get client notes error:", error);

        res.status(500).json({
            message: "Failed to get client notes",
            error: error.message
        });
    }
};


// ===============================
// UPDATE SESSION NOTE
// ===============================

const updateNote = async (req, res) => {
    try {
        const {
            content,
            visibility
        } = req.body;

        const note = await SessionNote.findOneAndUpdate(
            {
                _id: req.params.id,
                therapist: req.therapistId
            },
            {
                content,
                visibility
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!note) {
            return res.status(404).json({
                message: "Session note not found"
            });
        }

        res.status(200).json({
            message: "Session note updated successfully",
            note
        });

    } catch (error) {
        console.error("Update note error:", error);

        res.status(500).json({
            message: "Failed to update session note",
            error: error.message
        });
    }
};


// ===============================
// DELETE SESSION NOTE
// ===============================

const deleteNote = async (req, res) => {
    try {
        const note = await SessionNote.findOneAndDelete({
            _id: req.params.id,
            therapist: req.therapistId
        });

        if (!note) {
            return res.status(404).json({
                message: "Session note not found"
            });
        }

        res.status(200).json({
            message: "Session note deleted successfully"
        });

    } catch (error) {
        console.error("Delete note error:", error);

        res.status(500).json({
            message: "Failed to delete session note",
            error: error.message
        });
    }
};


// ===============================
// EXPORT
// ===============================

module.exports = {
    createNote,
    getNotes,
    getClientNotes,
    updateNote,
    deleteNote
};