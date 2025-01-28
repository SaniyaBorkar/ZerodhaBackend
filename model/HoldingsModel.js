const mongoose = require("mongoose");
const HoldingsSchema = require("../schema/HoldingsSchema");

// Create the Holdings Model
const HoldingsModel = mongoose.model("holding", HoldingsSchema);

module.exports = HoldingsModel; // Export the model
