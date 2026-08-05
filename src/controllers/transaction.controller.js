const asyncHandler = require("../utils/asyncHandler");
const transactionService = require("../services/transaction.service");

exports.createTransaction = asyncHandler(async (req, res) => {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  const transaction = await transactionService.createTransaction(
    fromAccount,
    toAccount,
    amount,
    idempotencyKey,
  );

  res
    .status(201)
    .json({ message: "Transaction created successfully", transaction });
});

exports.createInitialFundsTransaction = asyncHandler(async (req, res) => {
  const { toAccount, amount, idempotencyKey } = req.body;
  const systemUser = req.user; // Assuming the system user is authenticated and available in req.user

  const transaction = await transactionService.createInitialFundsTransaction(
    systemUser,
    toAccount,
    amount,
    idempotencyKey,
  );

  res.status(201).json({
    message: "Initial funds transaction created successfully",
    transaction,
  });
});
