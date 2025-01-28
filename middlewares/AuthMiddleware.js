const UsersModel = require("../model/UsersModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res) => {
  const token = req.cookies.token
  if (!token) {
    return res.json({ status: false })
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
     return res.json({ status: false })
    } else {
      const user = await UsersModel.findById(data.id)
      req.user = user;
      if (user) return  res.json({ status: true, user: user.username, id: user._id, funds: user.funds })
      else return res.json({ status: false })
    }
  })
}