const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Your username is required"],
  },
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  
  funds: {
    type: Number,
    default: 90000, // User's available funds
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to hash the password
UsersSchema.pre('save', async function () {
  if (this.isModified('password')) { // Hash only if the password is modified
    this.password = await bcrypt.hash(this.password, 12);
  }
});

module.exports = UsersSchema;
