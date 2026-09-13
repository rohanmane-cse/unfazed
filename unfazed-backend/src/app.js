const express = require("express");
const cors = require("cors");

const analyticsRoutes = require("./routes/analyticsRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const authRoutes = require("./routes/authRoutes");
const therapistRoutes = require("./routes/therapistRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const clientRoutes = require("./routes/clientRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const packageRoutes = require("./routes/packageRoutes");
const noteRoutes = require("./routes/noteRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

const authMiddleware = require("./middleware/authMiddleware");

const app = express();


// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

app.use(express.json());


// ===============================
// ROOT ROUTE
// ===============================

app.get("/", (req, res) => {
    res.json({
        message: "Unfazed API is running"
    });
});


// ===============================
// PROTECTED TEST ROUTE
// ===============================

app.get(
    "/api/protected",
    authMiddleware,
    (req, res) => {
        res.json({
            message: "You accessed a protected route",
            therapistId: req.therapistId
        });
    }
);


// ===============================
// AUTH ROUTES
// ===============================

app.use(
    "/api/auth",
    authRoutes
);


// ===============================
// THERAPIST ROUTES
// ===============================

app.use(
    "/api/therapist",
    therapistRoutes
);


// ===============================
// AVAILABILITY ROUTES
// ===============================

app.use(
    "/api/availability",
    availabilityRoutes
);


// ===============================
// SESSION ROUTES
// ===============================

app.use(
    "/api/sessions",
    sessionRoutes
);


// ===============================
// CLIENT ROUTES
// ===============================

app.use(
    "/api/clients",
    clientRoutes
);


// ===============================
// PAYMENT ROUTES
// ===============================

app.use(
    "/api/payments",
    paymentRoutes
);


// ===============================
// PACKAGE ROUTES
// ===============================

app.use(
    "/api/packages",
    packageRoutes
);


// ===============================
// NOTES ROUTES
// ===============================

app.use(
    "/api/notes",
    noteRoutes
);


// ===============================
// ANALYTICS ROUTES
// ===============================

app.use(
    "/api/analytics",
    analyticsRoutes
);


// ===============================
// SUBSCRIPTION ROUTES
// ===============================

app.use(
    "/api/subscription",
    subscriptionRoutes
);


// ===============================
// 404 HANDLER
// ===============================

app.use((req, res) => {
    res.status(404).json({
        message: "API route not found"
    });
});


// ===============================
// ERROR HANDLER
// ===============================

app.use((error, req, res, next) => {
    console.error("Server error:", error);

    res.status(500).json({
        message: "Internal server error"
    });
});


module.exports = app;