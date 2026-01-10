const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { placementOnly } = require("../middleware/role.middleware");
const {
    getPlacements,
    applyForPlacement,
    createPlacement
} = require("../controllers/placement.controller");

// Only for Users with isPlacementEnabled = true
router.use(protect);
router.use(placementOnly);

router.get("/", getPlacements);
router.post("/:id/apply", applyForPlacement);
router.post("/create", createPlacement); // Ideally protect this further for Admin

module.exports = router;
