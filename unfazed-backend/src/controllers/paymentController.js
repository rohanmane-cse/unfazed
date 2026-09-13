const crypto = require("crypto");

const Payment = require("../models/Payment");
const ClientPackage = require("../models/ClientPackage");
const Package = require("../models/Package");
const Client = require("../models/Client");

const razorpay = require("../config/razorpay");


// ========================================
// CREATE PAYMENT ORDER
// ========================================

const createPaymentOrder = async (req, res) => {
    try {
        const {
            client,
            session,
            packageId
        } = req.body;

        // Check required fields
        if (!client || !packageId) {
            return res.status(400).json({
                message: "Client and package are required"
            });
        }

        // Check Razorpay configuration
        if (!razorpay) {
            return res.status(500).json({
                message: "Razorpay is not configured"
            });
        }

        // Check that client belongs to therapist
        const clientData = await Client.findOne({
            _id: client,
            therapist: req.therapistId
        });

        if (!clientData) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        // Check package belongs to therapist
        const packageData = await Package.findOne({
            _id: packageId,
            therapist: req.therapistId,
            isActive: true
        });

        if (!packageData) {
            return res.status(404).json({
                message: "Package not found"
            });
        }

        // IMPORTANT:
        // Price comes from MongoDB.
        // Never trust price sent by frontend.

        const amount = packageData.price;

        if (amount <= 0) {
            return res.status(400).json({
                message: "Invalid package price"
            });
        }

        // Razorpay expects amount in paise
        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `unfazed_${Date.now()}`
        };

        // Create Razorpay order
        const order = await razorpay.orders.create(options);

        // Create payment record
        const payment = await Payment.create({
            therapist: req.therapistId,
            client: clientData._id,
            session: session || null,
            package: packageData._id,
            amount: amount,
            currency: "INR",
            status: "created",
            paymentMethod: "razorpay",
            razorpayOrderId: order.id
        });

        res.status(201).json({
            message: "Payment order created successfully",

            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency
            },

            paymentId: payment._id,

            package: {
                id: packageData._id,
                name: packageData.name,
                sessionCount: packageData.sessionCount,
                validityDays: packageData.validityDays,
                price: packageData.price
            }
        });

    } catch (error) {
        console.error(
            "Create Razorpay order error:",
            error
        );

        res.status(500).json({
            message: "Failed to create payment order",
            error: error.message
        });
    }
};


// ========================================
// VERIFY PAYMENT
// ========================================

const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        // Check payment information
        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                message:
                    "Payment verification details are required"
            });
        }

        // Find payment belonging to logged-in therapist
        const payment = await Payment.findOne({
            razorpayOrderId: razorpay_order_id,
            therapist: req.therapistId
        });

        if (!payment) {
            return res.status(404).json({
                message: "Payment record not found"
            });
        }

        // Generate signature
        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                razorpay_order_id +
                "|" +
                razorpay_payment_id
            )
            .digest("hex");

        // Compare signatures
        if (
            generatedSignature !==
            razorpay_signature
        ) {
            return res.status(400).json({
                message: "Invalid payment signature"
            });
        }

        // Idempotency:
        // If payment was already verified,
        // don't create another ClientPackage.

        if (
            payment.status === "paid" &&
            payment.razorpayPaymentId
        ) {
            const existingClientPackage =
                await ClientPackage.findOne({
                    therapist: payment.therapist,
                    client: payment.client,
                    package: payment.package,
                    purchasedAmount: payment.amount
                });

            return res.json({
                message: "Payment already verified",
                payment,
                clientPackage:
                    existingClientPackage
            });
        }

        // Update payment
        payment.razorpayPaymentId =
            razorpay_payment_id;

        payment.status = "paid";

        payment.paidAt = new Date();

        await payment.save();

        // Find package
        const packageData =
            await Package.findOne({
                _id: payment.package,
                therapist: req.therapistId,
                isActive: true
            });

        if (!packageData) {
            return res.status(404).json({
                message: "Package not found"
            });
        }

        // Check if package was already activated
        const existingClientPackage =
            await ClientPackage.findOne({
                therapist: payment.therapist,
                client: payment.client,
                package: payment.package,
                purchasedAmount: payment.amount
            });

        if (existingClientPackage) {
            return res.json({
                message: "Payment verified successfully",
                payment,
                clientPackage:
                    existingClientPackage
            });
        }

        // Calculate expiry date
        const expiryDate = new Date();

        expiryDate.setDate(
            expiryDate.getDate() +
            packageData.validityDays
        );

        // Create ClientPackage
        const clientPackage =
            await ClientPackage.create({
                therapist: payment.therapist,

                client: payment.client,

                package: packageData._id,

                totalSessions:
                    packageData.sessionCount,

                usedSessions: 0,

                remainingSessions:
                    packageData.sessionCount,

                purchasedAmount:
                    payment.amount,

                purchaseDate: new Date(),

                expiryDate,

                status: "active"
            });

        res.json({
            message:
                "Payment verified successfully",

            payment,

            clientPackage
        });

    } catch (error) {
        console.error(
            "Payment verification error:",
            error
        );

        res.status(500).json({
            message:
                "Payment verification failed",
            error: error.message
        });
    }
};


// ========================================
// RAZORPAY WEBHOOK
// ========================================

const webhook = async (req, res) => {
    try {
        const webhookSecret =
            process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!webhookSecret) {
            return res.status(500).json({
                message:
                    "Webhook secret is not configured"
            });
        }

        const signature =
            req.headers[
                "x-razorpay-signature"
            ];

        if (!signature) {
            return res.status(400).json({
                message:
                    "Webhook signature is missing"
            });
        }

        // NOTE:
        // For production, this should use the
        // raw request body. We will fix the
        // Express raw-body configuration during
        // final integration/testing.

        const expectedSignature =
            crypto
                .createHmac(
                    "sha256",
                    webhookSecret
                )
                .update(
                    JSON.stringify(req.body)
                )
                .digest("hex");

        if (
            signature !==
            expectedSignature
        ) {
            return res.status(400).json({
                message:
                    "Invalid webhook signature"
            });
        }

        const event = req.body.event;

        // ====================================
        // PAYMENT CAPTURED
        // ====================================

        if (
            event ===
            "payment.captured"
        ) {
            const paymentEntity =
                req.body.payload
                    ?.payment
                    ?.entity;

            if (!paymentEntity) {
                return res.status(400).json({
                    message:
                        "Payment information missing"
                });
            }

            const payment =
                await Payment.findOneAndUpdate(
                    {
                        razorpayOrderId:
                            paymentEntity.order_id
                    },
                    {
                        razorpayPaymentId:
                            paymentEntity.id,

                        status: "paid",

                        paidAt: new Date()
                    },
                    {
                        new: true
                    }
                );

            // Activate ClientPackage
            if (payment) {
                const existingPackage =
                    await ClientPackage.findOne({
                        therapist:
                            payment.therapist,

                        client:
                            payment.client,

                        package:
                            payment.package,

                        purchasedAmount:
                            payment.amount
                    });

                if (!existingPackage) {
                    const packageData =
                        await Package.findOne({
                            _id:
                                payment.package,

                            therapist:
                                payment.therapist,

                            isActive: true
                        });

                    if (packageData) {
                        const expiryDate =
                            new Date();

                        expiryDate.setDate(
                            expiryDate.getDate() +
                            packageData.validityDays
                        );

                        await ClientPackage.create({
                            therapist:
                                payment.therapist,

                            client:
                                payment.client,

                            package:
                                packageData._id,

                            totalSessions:
                                packageData.sessionCount,

                            usedSessions: 0,

                            remainingSessions:
                                packageData.sessionCount,

                            purchasedAmount:
                                payment.amount,

                            purchaseDate:
                                new Date(),

                            expiryDate,

                            status: "active"
                        });
                    }
                }
            }
        }

        // ====================================
        // PAYMENT FAILED
        // ====================================

        if (
            event ===
            "payment.failed"
        ) {
            const paymentEntity =
                req.body.payload
                    ?.payment
                    ?.entity;

            if (paymentEntity) {
                await Payment.findOneAndUpdate(
                    {
                        razorpayOrderId:
                            paymentEntity.order_id
                    },
                    {
                        razorpayPaymentId:
                            paymentEntity.id,

                        status: "failed"
                    }
                );
            }
        }

        res.json({
            message:
                "Webhook processed successfully"
        });

    } catch (error) {
        console.error(
            "Webhook error:",
            error
        );

        res.status(500).json({
            message:
                "Webhook processing failed"
        });
    }
};


module.exports = {
    createPaymentOrder,
    verifyPayment,
    webhook
};