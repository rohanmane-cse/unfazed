const Therapist = require("../models/Therapist");

// GET LOGGED-IN THERAPIST PROFILE
const getProfile = async (req, res) => {
    try {
        const therapist = await Therapist.findById(req.therapistId)
            .select("-password_hash");

        if (!therapist) {
            return res.status(404).json({
                message: "Therapist not found"
            });
        }

        res.json({
            therapist
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get profile",
            error: error.message
        });
    }
};


// UPDATE THERAPIST PROFILE
const updateProfile = async (req, res) => {
    try {
        const { bio, specializations, languages } = req.body;

        const therapist = await Therapist.findByIdAndUpdate(
            req.therapistId,
            {
                bio,
                specializations,
                languages
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password_hash");

        if (!therapist) {
            return res.status(404).json({
                message: "Therapist not found"
            });
        }

        res.json({
            message: "Profile updated successfully",
            therapist
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update profile",
            error: error.message
        });
    }
};


// GET PUBLIC THERAPIST PROFILE BY SLUG
const getPublicTherapist = async (req, res) => {
    try {
        const { slug } = req.params;

        const therapist = await Therapist.findOne({
            slug: slug.toLowerCase()
        }).select(
            "name slug bio specializations languages"
        );

        if (!therapist) {
            return res.status(404).json({
                message: "Therapist not found"
            });
        }

        res.json({
            therapist
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get public therapist profile",
            error: error.message
        });
    }
};


module.exports = {
    getProfile,
    updateProfile,
    getPublicTherapist
};