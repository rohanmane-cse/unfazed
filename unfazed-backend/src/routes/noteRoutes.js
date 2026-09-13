const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
    createNote,
    getNotes,
    getClientNotes,
    updateNote,
    deleteNote
} = require("../controllers/noteController");

const router = express.Router();


// CREATE NOTE
router.post(
    "/",
    authMiddleware,
    createNote
);


// GET ALL NOTES
router.get(
    "/",
    authMiddleware,
    getNotes
);


// GET NOTES FOR ONE CLIENT
router.get(
    "/client/:clientId",
    authMiddleware,
    getClientNotes
);


// UPDATE NOTE
router.put(
    "/:id",
    authMiddleware,
    updateNote
);


// DELETE NOTE
router.delete(
    "/:id",
    authMiddleware,
    deleteNote
);


module.exports = router;