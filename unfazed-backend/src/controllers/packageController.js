const Package = require("../models/Package");
const Therapist = require("../models/Therapist");

// CREATE PACKAGE
const createPackage = async (req, res) => {
    try {
        const {
            name,
            description,
            sessionCount,
            price,
            validityDays
        } = req.body;

        if (!name || !sessionCount || price === undefined) {
            return res.status(400).json({
                message: "Name, session count and price are required"
            });
        }

        const packageData = await Package.create({
            therapist: req.therapistId,
            name,
            description,
            sessionCount,
            price,
            validityDays
        });

        res.status(201).json({
            message: "Package created successfully",
            package: packageData
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create package",
            error: error.message
        });
    }
};


// GET PACKAGES FOR LOGGED-IN THERAPIST
const getPackages = async (req, res) => {
    try {
        const packages = await Package.find({
            therapist: req.therapistId
        }).sort({ createdAt: -1 });

        res.json({
            packages
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get packages",
            error: error.message
        });
    }
};


// GET PUBLIC PACKAGES BY THERAPIST SLUG
const getPublicPackages = async (req, res) => {
    try {
        const { slug } = req.params;

        // Find therapist using public slug
        const therapist = await Therapist.findOne({
            slug: slug.toLowerCase()
        }).select("_id");

        if (!therapist) {
            return res.status(404).json({
                message: "Therapist not found"
            });
        }

        // Get only active packages
        const packages = await Package.find({
            therapist: therapist._id,
            isActive: true
        })
            .select(
                "name description sessionCount price validityDays isActive"
            )
            .sort({ createdAt: -1 });

        res.json({
            packages
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get public packages",
            error: error.message
        });
    }
};


module.exports = {
    createPackage,
    getPackages,
    getPublicPackages
};