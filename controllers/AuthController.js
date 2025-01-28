const UsersModel = require("../model/UsersModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;
    const existingUser = await UsersModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists", success: false });
    }
    const user = await UsersModel.create({ email, password, username, createdAt });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
      // secure: true, // Ensures cookie is sent over HTTPS only
      // sameSite: "strict", // Prevents CSRF
    });
    return res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if(!email || !password ){
      return res.json({message:'All fields are required'})
    }
    const user = await UsersModel.findOne({ email });
    if(!user){
      return res.json({message:'Incorrect password or email' }) 
    }
    const auth = await bcrypt.compare(password,user.password)
    if (!auth) {
      return res.json({message:'Incorrect password or email' }) 
    }
     const token = createSecretToken(user._id);
     console.log(token);
     res.cookie("token", token, {
       withCredentials: true,
       httpOnly: true,   // Prevents client-side access
        secure: true,     // Ensures cookies are sent only over HTTPS
        sameSite: 'None', // Required for cross-origin requests
        maxAge: 24 * 60 * 60 * 1000,
     });
     res.status(201).json({ message: "User logged in successfully", success: true });
     next()
  } catch (error) {
    console.error(error);
  }
}