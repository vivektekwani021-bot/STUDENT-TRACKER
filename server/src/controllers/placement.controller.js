const Placement = require("../models/Placement.model");

// Get all placements (accessible to eligible students)
exports.getPlacements = async (req, res) => {
    try {
        const placements = await Placement.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, placements });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Apply for a placement
exports.applyForPlacement = async (req, res) => {
    try {
        const { id } = req.params;
        const placement = await Placement.findById(id);

        if (!placement) {
            return res.status(404).json({ message: "Placement not found" });
        }

        if (placement.applicants.includes(req.user._id)) {
            return res.status(400).json({ message: "Already applied" });
        }

        placement.applicants.push(req.user._id);
        await placement.save();

        res.status(200).json({ success: true, message: "Applied successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Create placement (For demo purposes, accessible to anyone or protect later)
exports.createPlacement = async (req, res) => {
    try {
        const placement = await Placement.create(req.body);
        res.status(201).json({ success: true, placement });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
