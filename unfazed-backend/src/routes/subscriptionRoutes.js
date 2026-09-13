const express = require("express");

const authMiddleware =
    require("../middleware/authMiddleware");

const {
    getCurrentSubscription,
    getSubscriptionPlans,
    changeSubscription
} = require("../controllers/subscriptionController");

const router = express.Router();


// ========================================
// CURRENT SUBSCRIPTION
// ========================================

router.get(
    "/current",
    authMiddleware,
    getCurrentSubscription
);


// ========================================
// AVAILABLE PLANS
// ========================================

router.get(
    "/plans",
    authMiddleware,
    getSubscriptionPlans
);


// ========================================
// CHANGE PLAN
// ========================================

router.put(
    "/change",
    authMiddleware,
    changeSubscription
);


module.exports = router;