const accountModel = require("../models/account.model");

exports.createAccount = async (userId) => {
  return accountModel.create({
    user: userId,
  });
};

exports.getAccountsByUserId = async (userId) => {
  return accountModel.find({ user: userId });
};

exports.findAccountById = async (accountId) => {
  return accountModel.findById({ _id: accountId });
};
