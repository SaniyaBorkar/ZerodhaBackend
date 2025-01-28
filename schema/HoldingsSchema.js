
const mongoose = require("mongoose");
const UsersModel = require("../model/UsersModel");
const { Schema } = mongoose;

// Define the Holdings Schema
const HoldingsSchema = new Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  avg: { type: Number, default: 1383.4, required: true },
  price: { type: Number, required: true },
  net: { type: String, default: "+0.11%", required: true },
  day: { type: String, default: "+0.11%", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "Users" }
},  { timestamps: true }
);
module.exports = HoldingsSchema; // Export only the schema
