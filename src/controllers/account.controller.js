const asyncHandler = require("../utils/asyncHandler");
const accountService = require("../services/account.service");

/**
 * @desc    Create a new account
 * @route   POST /api/account/
 * @access  Private route, requires authentication
 */
exports.createAccount = asyncHandler(async (req, res) => {
  const user = req.user;

  const account = await accountService.createAccount(user._id);

  res.status(201).json(account);
});

exports.getAllAccounts = asyncHandler(async (req, res) => {
  const user = req.user;
  const accounts = await accountService.getAccountsByUserId(user._id);
  res.status(200).json(accounts);
});

exports.getAccountBalance = asyncHandler(async (req, res) => {
  const user = req.user;
  const accountId = req.params.accountId;

  const accounts = await accountService.getAccountsByUserId(user._id);
  const account = accounts.find((acc) => acc._id.toString() === accountId);
  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  res.status(200).json({ balance: account.balance });
});
