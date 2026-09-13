const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
    getAnalytics
} = require("../controllers/analyticsController");

const router = express.Router();


// ========================================
// GET ANALYTICS
// ========================================

router.get(
    "/",
    authMiddleware,
    getAnalytics
);


module.exports = router;