const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const accountController = require("../controllers/account.controller");

/**
 * @route   POST /api/account/
 * @desc    Create a new account
 * @access  Private route, requires authentication
 */
router.post(
  "/",
  authMiddleware.authMiddleware,
  accountController.createAccount,
);

router.get(
  "/get-all-accounts",
  authMiddleware.authMiddleware,
  accountController.getAllAccounts,
);

router.get(
  "/balance/:accountId",
  authMiddleware.authMiddleware,
  userController.getAccountBalance,
);

module.exports = router;
