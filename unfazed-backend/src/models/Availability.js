const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
    {
        therapist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Therapist",
            required: true
        },

        dayOfWeek: {
            type: Number,
            required: true,
            min: 0,
            max: 6
        },

        startTime: {
            type: String,
            required: true
        },

        endTime: {
            type: String,
            required: true
        },

        sessionDuration: {
            type: Number,
            default: 60
        },

        bufferTime: {
            type: Number,
            default: 0
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Availability", availabilitySchema);