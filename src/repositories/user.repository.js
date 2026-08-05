const userModel = require("../models/user.model");

exports.createUser = async (username, email, password) => {
  return await userModel.create({ username, email, password });
};

exports.findById = async (id) => {
  return await userModel.findById(id);
};

exports.findByIdWithPassword = async (id) => {
  return await userModel.findById(id).select("+password");
};

exports.findByEmail = async (email) => {
  return await userModel.findOne({ email });
};

exports.findByEmailWithPassword = async (email) => {
  return await userModel.findOne({ email }).select("+password");
};

exports.findByIdWithSystemUser = async (id) => {
  return await userModel.findById(id).select("+systemUser");
};
