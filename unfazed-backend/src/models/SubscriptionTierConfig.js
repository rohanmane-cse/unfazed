const mongoose = require("mongoose");

const subscriptionTierConfigSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        maxClients: {
            type: Number,
            default: 10
        },

        maxSessionsPerMonth: {
            type: Number,
            default: 20
        },

        analyticsEnabled: {
            type: Boolean,
            default: false
        },

        chatEnabled: {
            type: Boolean,
            default: false
        },

        paymentsEnabled: {
            type: Boolean,
            default: false
        },

        notesEnabled: {
            type: Boolean,
            default: true
        },

        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "SubscriptionTierConfig",
    subscriptionTierConfigSchema
);