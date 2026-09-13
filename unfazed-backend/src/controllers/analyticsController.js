const Client = require("../models/Client");
const Session = require("../models/Session");
const Payment = require("../models/Payment");


// ========================================
// GET ANALYTICS
// ========================================

const getAnalytics = async (req, res) => {
    try {

        const therapistId = req.therapistId;


        // ========================================
        // TOTAL CLIENTS
        // ========================================

        const totalClients = await Client.countDocuments({
            therapist: therapistId
        });


        // ========================================
        // TOTAL SESSIONS
        // ========================================

        const totalSessions = await Session.countDocuments({
            therapist: therapistId
        });


        // ========================================
        // COMPLETED SESSIONS
        // ========================================

        const completedSessions =
            await Session.countDocuments({
                therapist: therapistId,
                status: "completed"
            });


        // ========================================
        // CANCELLED SESSIONS
        // ========================================

        const cancelledSessions =
            await Session.countDocuments({
                therapist: therapistId,
                status: "cancelled"
            });


        // ========================================
        // NO-SHOW SESSIONS
        // ========================================

        const noShowSessions =
            await Session.countDocuments({
                therapist: therapistId,
                status: "no-show"
            });


        // ========================================
        // UPCOMING SESSIONS
        // ========================================

        const upcomingSessions =
            await Session.countDocuments({
                therapist: therapistId,
                date: {
                    $gte: new Date()
                },
                status: {
                    $in: ["scheduled", "confirmed"]
                }
            });


        // ========================================
        // TOTAL REVENUE
        // ========================================

        const revenueResult =
            await Payment.aggregate([
                {
                    $match: {
                        therapist: therapistId,
                        status: "paid"
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: {
                            $sum: "$amount"
                        }
                    }
                }
            ]);


        const totalRevenue =
            revenueResult.length > 0
                ? revenueResult[0].totalRevenue
                : 0;


        // ========================================
        // PAID PAYMENTS
        // ========================================

        const paidPayments =
            await Payment.countDocuments({
                therapist: therapistId,
                status: "paid"
            });


        // ========================================
        // FAILED PAYMENTS
        // ========================================

        const failedPayments =
            await Payment.countDocuments({
                therapist: therapistId,
                status: "failed"
            });


        // ========================================
        // RESPONSE
        // ========================================

        res.json({
            analytics: {
                totalClients,
                totalSessions,
                completedSessions,
                cancelledSessions,
                noShowSessions,
                upcomingSessions,
                totalRevenue,
                paidPayments,
                failedPayments
            }
        });

    } catch (error) {

        console.error(
            "Analytics error:",
            error
        );

        res.status(500).json({
            message: "Failed to load analytics",
            error: error.message
        });
    }
};


module.exports = {
    getAnalytics
};