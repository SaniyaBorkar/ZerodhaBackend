const mongoose = require('mongoose');
const UsersSchema = require('../schema/UsersSchema'); // Adjust the path as per your project structure

const UsersModel = mongoose.model('User', UsersSchema); // Correct name reference

module.exports = UsersModel;
