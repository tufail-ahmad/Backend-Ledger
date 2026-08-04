const userModel = require("../models/user.model");

exports.createUser = async (username, email, password) => {
  return await userModel.create({ username, email, password });
};

exports.findByEmail = async (email) => {
  return await userModel.findOne({ email }).select("+password"); // Ensure password is selected for comparison
};
