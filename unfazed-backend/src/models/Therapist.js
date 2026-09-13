const mongoose = require("mongoose");

const therapistSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password_hash: {
            type: String,
            required: true
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        bio: {
            type: String,
            default: ""
        },

        specializations: {
            type: [String],
            default: []
        },

        languages: {
            type: [String],
            default: []
        },

        // ========================================
        // SUBSCRIPTION
        // ========================================

        subscriptionTier: {
            type: String,
            enum: [
                "Free",
                "Pro",
                "Premium"
            ],
            default: "Free"
        },

        subscriptionStatus: {
            type: String,
            enum: [
                "active",
                "inactive",
                "cancelled",
                "expired"
            ],
            default: "active"
        },

        subscriptionStartDate: {
            type: Date,
            default: Date.now
        },

        subscriptionEndDate: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model(
        "Therapist",
        therapistSchema
    );