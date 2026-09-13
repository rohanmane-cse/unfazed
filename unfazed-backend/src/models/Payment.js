const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
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

        session: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            default: null
        },
        package: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Package",
            default: null
        },

        amount: {
            type: Number,
            required: true
        },

        currency: {
            type: String,
            default: "INR"
        },

        status: {
            type: String,
            enum: [
                "created",
                "pending",
                "paid",
                "failed",
                "refunded"
            ],
            default: "created"
        },

        paymentMethod: {
            type: String,
            default: "razorpay"
        },

        razorpayOrderId: {
            type: String,
            default: ""
        },

        razorpayPaymentId: {
            type: String,
            default: ""
        },

        paidAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Payment", paymentSchema);