const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
    {
        therapist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Therapist",
            required: true
        },

        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        startTime: {
            type: String,
            required: true
        },

        endTime: {
            type: String,
            required: true
        },

        duration: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: [
                "scheduled",
                "confirmed",
                "completed",
                "cancelled",
                "no-show"
            ],
            default: "scheduled"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Session", sessionSchema);