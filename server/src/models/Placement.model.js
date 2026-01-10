const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true
        },
        package: {
            type: String, // e.g., "12 LPA"
            required: true
        },
        description: String,
        eligibilityCriteria: {
            type: String,
            default: "60% aggregate"
        },
        deadline: {
            type: Date,
            required: true
        },
        applicants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Placement", placementSchema);
