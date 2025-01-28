const mongoose = require('mongoose');
const {Schema} = require("mongoose");
const BidsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    default: 1, // User's available funds
  },
  price: {
    type: Number,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  }
  
});



module.exports = BidsSchema;
