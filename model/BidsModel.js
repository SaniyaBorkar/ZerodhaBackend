const mongoose = require('mongoose');
const BidsSchema = require('../schema/BidsSchema'); // Adjust the path as per your project structure

const BidsModel = mongoose.model('bid', BidsSchema); // Correct name reference

module.exports = BidsModel;
