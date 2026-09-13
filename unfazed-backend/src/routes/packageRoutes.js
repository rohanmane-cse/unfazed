const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
    createPackage,
    getPackages,
    getPublicPackages
} = require("../controllers/packageController");

const router = express.Router();


// PUBLIC PACKAGES
router.get(
    "/public/:slug",
    getPublicPackages
);


// PROTECTED PACKAGE ROUTES
router.post(
    "/",
    authMiddleware,
    createPackage
);

router.get(
    "/",
    authMiddleware,
    getPackages
);


module.exports = router;