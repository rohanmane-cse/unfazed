const SubscriptionTierConfig =
    require("../models/SubscriptionTierConfig");

const Therapist =
    require("../models/Therapist");


// ========================================
// GET CURRENT SUBSCRIPTION
// ========================================

const getCurrentSubscription =
    async (req, res) => {

        try {

            const therapist =
                await Therapist.findById(
                    req.therapistId
                );

            if (!therapist) {
                return res.status(404).json({
                    message: "Therapist not found"
                });
            }


            const tier =
                await SubscriptionTierConfig.findOne({
                    name: therapist.subscriptionTier,
                    active: true
                });


            res.json({
                subscription: {
                    tier:
                        therapist.subscriptionTier,

                    status:
                        therapist.subscriptionStatus,

                    startDate:
                        therapist.subscriptionStartDate,

                    endDate:
                        therapist.subscriptionEndDate,

                    config: tier
                }
            });

        } catch (error) {

            console.error(
                "Subscription error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to load subscription",
                error: error.message
            });
        }
    };


// ========================================
// GET ALL AVAILABLE PLANS
// ========================================

const getSubscriptionPlans =
    async (req, res) => {

        try {

            const plans =
                await SubscriptionTierConfig.find({
                    active: true
                }).sort({
                    price: 1
                });


            res.json({
                plans
            });

        } catch (error) {

            console.error(
                "Plans error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to load subscription plans",
                error: error.message
            });
        }
    };


// ========================================
// CHANGE SUBSCRIPTION
// ========================================

const changeSubscription =
    async (req, res) => {

        try {

            const { tier } = req.body;


            if (
                !tier ||
                ![
                    "Free",
                    "Pro",
                    "Premium"
                ].includes(tier)
            ) {

                return res.status(400).json({
                    message:
                        "Invalid subscription tier"
                });
            }


            const tierConfig =
                await SubscriptionTierConfig.findOne({
                    name: tier,
                    active: true
                });


            if (!tierConfig) {

                return res.status(404).json({
                    message:
                        "Subscription plan not found"
                });
            }


            const therapist =
                await Therapist.findById(
                    req.therapistId
                );


            if (!therapist) {

                return res.status(404).json({
                    message:
                        "Therapist not found"
                });
            }


            therapist.subscriptionTier =
                tier;

            therapist.subscriptionStatus =
                "active";

            therapist.subscriptionStartDate =
                new Date();


            await therapist.save();


            res.json({
                message:
                    "Subscription updated successfully",

                subscription: {
                    tier:
                        therapist.subscriptionTier,

                    status:
                        therapist.subscriptionStatus,

                    startDate:
                        therapist.subscriptionStartDate
                }
            });

        } catch (error) {

            console.error(
                "Change subscription error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to update subscription",
                error: error.message
            });
        }
    };


module.exports = {
    getCurrentSubscription,
    getSubscriptionPlans,
    changeSubscription
};