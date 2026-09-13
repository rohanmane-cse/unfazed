const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
    createClient,
    getClients,
    getClient,
    updateClient,
    deleteClient,
    createPublicClient
} = require("../controllers/clientController");

const router = express.Router();


// PUBLIC CLIENT INTAKE
router.post(
    "/public",
    createPublicClient
);


// PROTECTED CLIENT CRM
router.post(
    "/",
    authMiddleware,
    createClient
);

router.get(
    "/",
    authMiddleware,
    getClients
);

router.get(
    "/:id",
    authMiddleware,
    getClient
);

router.put(
    "/:id",
    authMiddleware,
    updateClient
);

router.delete(
    "/:id",
    authMiddleware,
    deleteClient
);


module.exports = router;