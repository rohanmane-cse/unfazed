const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
    createPaymentOrder,
    verifyPayment,
    webhook
} = require("../controllers/paymentController");

const router = express.Router();

router.post(
    "/create-order",
    authMiddleware,
    createPaymentOrder
);

router.post(
    "/verify",
    authMiddleware,
    verifyPayment
);

router.post(
    "/webhook",
    webhook
);

module.exports = router;