const mongoose = require("mongoose");
const transactionModel = require("../models/transaction.model");
const accountModel = require("../models/account.model");
const ledgerModel = require("../models/ledger.model");

exports.findByIdempotencyKey = async (idempotencyKey) => {
  return transactionModel.findOne({ idempotencyKey });
};

exports.findAccountById = async (accountId) => {
  return accountModel.findById(accountId);
};

exports.findSystemAccount = async (userId) => {
  return accountModel.findOne({
    user: userId,
  });
};

exports.startTransaction = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();
  return session;
};

exports.commitTransaction = async (session) => {
  await session.commitTransaction();
};

exports.abortTransaction = async (session) => {
  await session.abortTransaction();
};

// Create Initial Funds Transaction
exports.createInitialFundsTransaction = async (
  fromAccount,
  toAccount,
  amount,
  idempotencyKey,
  session,
) => {
  // Create transaction document
  const [transaction] = await transactionModel.create(
    [
      {
        fromAccount: fromAccount._id,
        toAccount: toAccount._id,
        amount,
        idempotencyKey,
      },
    ],
    { session },
  );

  // Debit system account
  fromAccount.balance -= amount;
  await fromAccount.save({ session });

  // Credit destination account
  toAccount.balance += amount;
  await toAccount.save({ session });

  // Create debit ledger entry
  await ledgerModel.create(
    [
      {
        account: fromAccount._id,
        type: "DEBIT",
        amount,
        transaction: transaction._id,
      },
    ],
    { session },
  );

  // Create credit ledger entry
  await ledgerModel.create(
    [
      {
        account: toAccount._id,
        type: "CREDIT",
        amount,
        transaction: transaction._id,
      },
    ],
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  return transaction;
};
