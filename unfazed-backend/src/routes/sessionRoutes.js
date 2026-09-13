const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
    createSession,
    getSessions
} = require("../controllers/sessionController");

const router = express.Router();


// CREATE SESSION

router.post(
    "/",
    authMiddleware,
    createSession
);


// GET ALL SESSIONS

router.get(
    "/",
    authMiddleware,
    getSessions
);


module.exports = router;