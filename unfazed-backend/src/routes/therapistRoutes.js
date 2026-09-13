const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
    getProfile,
    updateProfile,
    getPublicTherapist
} = require("../controllers/therapistController");

const router = express.Router();


// PUBLIC THERAPIST PROFILE
router.get(
    "/public/:slug",
    getPublicTherapist
);


// PROTECTED THERAPIST PROFILE
router.get(
    "/profile",
    authMiddleware,
    getProfile
);


// UPDATE THERAPIST PROFILE
router.put(
    "/profile",
    authMiddleware,
    updateProfile
);


module.exports = router;