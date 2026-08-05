const accountRepository = require("../repositories/account.repository");

exports.createAccount = async (userId) => {
  return accountRepository.createAccount(userId);
};

exports.getAccountsByUserId = async (userId) => {
  return accountRepository.getAccountsByUserId(userId);
};
