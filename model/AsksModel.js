const mongoose = require('mongoose');
const AsksSchema = require('../schema/AsksSchema'); // Adjust the path as per your project structure

const AsksModel = mongoose.model('ask', AsksSchema); // Correct name reference

module.exports = AsksModel;
