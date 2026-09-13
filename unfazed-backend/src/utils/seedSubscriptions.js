 require("dotenv").config();

const connectDB = require("../config/db");
const SubscriptionTierConfig =
    require("../models/SubscriptionTierConfig");

const seedSubscriptions = async () => {
    try {
        await connectDB();

        await SubscriptionTierConfig.deleteMany({});

        const plans = [
            {
                name: "Free",
                price: 0,

                maxClients: 10,

                maxSessionsPerMonth: 20,

                analyticsEnabled: false,

                chatEnabled: false,

                paymentsEnabled: false,

                notesEnabled: true,

                active: true
            },

            {
                name: "Pro",
                price: 999,

                maxClients: 50,

                maxSessionsPerMonth: 100,

                analyticsEnabled: true,

                chatEnabled: true,

                paymentsEnabled: true,

                notesEnabled: true,

                active: true
            },

            {
                name: "Premium",
                price: 1999,

                maxClients: 999999,

                maxSessionsPerMonth: 999999,

                analyticsEnabled: true,

                chatEnabled: true,

                paymentsEnabled: true,

                notesEnabled: true,

                active: true
            }
        ];

        await SubscriptionTierConfig.insertMany(
            plans
        );

        console.log(
            "Subscription plans seeded successfully"
        );

        console.log(
            "Free, Pro and Premium plans created"
        );

        process.exit(0);

    } catch (error) {

        console.error(
            "Subscription seed failed:",
            error.message
        );

        process.exit(1);
    }
};

seedSubscriptions();