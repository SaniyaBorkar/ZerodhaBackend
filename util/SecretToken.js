require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    httpOnly: true,   // Prevents client-side access
  secure: true,     // Ensures cookies are sent only over HTTPS
  sameSite: 'None', // Required for cross-origin requests
  maxAge: 24 * 60 * 60 * 1000,
  });
};