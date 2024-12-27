const { AuthModel } = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Login = async (req, res) => {
  try {
    // console.log(req.body)
    const { email, password, role } = req.body;
    const user = await AuthModel.findOne({ email });
    if (!user || user.role !== role) {
      throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res
      .status(200)
      .json({
        token,
        message: "Login successful",
        user: {
          email: user.email,
          role: user.role,
          department: user.department,
        },
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const Register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;
    const user = await AuthModel.findOne({ email });
    if (user) {
      throw new Error("User already exists");
    }
    if (role !== "admin" && !department) {
      throw new Error("Department is required");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new AuthModel({
      name,
      email,
      password: hashedPassword,
      role,
      department: role === "admin" ? null : department,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = { Login, Register };
