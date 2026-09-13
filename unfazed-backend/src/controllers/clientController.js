const Client = require("../models/Client");
const Therapist = require("../models/Therapist");


// CREATE CLIENT
const createClient = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            presentingConcern,
            history,
            consentGiven
        } = req.body;

        const client = await Client.create({
            therapist: req.therapistId,
            name,
            email,
            phone,
            presentingConcern,
            history,
            consentGiven,
            consentDate: consentGiven ? new Date() : null
        });

        res.status(201).json({
            message: "Client created successfully",
            client
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create client",
            error: error.message
        });
    }
};


// GET ALL CLIENTS
const getClients = async (req, res) => {
    try {
        const clients = await Client.find({
            therapist: req.therapistId
        }).sort({ createdAt: -1 });

        res.json({
            clients
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get clients",
            error: error.message
        });
    }
};


// GET ONE CLIENT
const getClient = async (req, res) => {
    try {
        const client = await Client.findOne({
            _id: req.params.id,
            therapist: req.therapistId
        });

        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        res.json({
            client
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get client",
            error: error.message
        });
    }
};


// UPDATE CLIENT
const updateClient = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            presentingConcern,
            history,
            consentGiven
        } = req.body;

        const client = await Client.findOneAndUpdate(
            {
                _id: req.params.id,
                therapist: req.therapistId
            },
            {
                name,
                email,
                phone,
                presentingConcern,
                history,
                consentGiven,
                consentDate: consentGiven ? new Date() : null
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        res.json({
            message: "Client updated successfully",
            client
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update client",
            error: error.message
        });
    }
};


// DELETE CLIENT
const deleteClient = async (req, res) => {
    try {
        const client = await Client.findOneAndDelete({
            _id: req.params.id,
            therapist: req.therapistId
        });

        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        res.json({
            message: "Client deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete client",
            error: error.message
        });
    }
};


// PUBLIC CLIENT INTAKE
const createPublicClient = async (req, res) => {
    try {
        const {
            therapistSlug,
            name,
            email,
            phone,
            presentingConcern,
            history,
            consentGiven
        } = req.body;

        if (!therapistSlug) {
            return res.status(400).json({
                message: "Therapist information is required"
            });
        }

        if (!name || !email || !presentingConcern) {
            return res.status(400).json({
                message: "Name, email and presenting concern are required"
            });
        }

        if (!consentGiven) {
            return res.status(400).json({
                message: "Consent is required"
            });
        }

        // Find therapist using public slug
        const therapist = await Therapist.findOne({
            slug: therapistSlug.toLowerCase()
        }).select("_id");

        if (!therapist) {
            return res.status(404).json({
                message: "Therapist not found"
            });
        }

        // Create client
        const client = await Client.create({
            therapist: therapist._id,
            name,
            email,
            phone,
            presentingConcern,
            history,
            consentGiven: true,
            consentDate: new Date()
        });

        res.status(201).json({
            message: "Intake submitted successfully",
            client: {
                _id: client._id,
                name: client.name,
                email: client.email
            }
        });

    } catch (error) {
        console.error("Public intake error:", error);

        res.status(500).json({
            message: "Failed to submit intake",
            error: error.message
        });
    }
};


module.exports = {
    createClient,
    getClients,
    getClient,
    updateClient,
    deleteClient,
    createPublicClient
};