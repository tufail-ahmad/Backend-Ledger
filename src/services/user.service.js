const userRepository = require("../repositories/user.repository");
const apiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../configs/configs");

exports.register = async (username, email, password) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new apiError(422, "User already exists with this email");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  return await userRepository.createUser(username, email, hashedPassword);
};

exports.login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new apiError(401, "Invalid email or password");
  }
  console.log("User found:", user); // Debugging line to check if user is found
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new apiError(401, "Invalid email or password");
  }

  const refreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });
  const accessToken = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "15m",
  });
  return { accessToken, refreshToken, user };
};
