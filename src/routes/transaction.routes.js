const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const transactionController = require("../controllers/transaction.controller");

router.post(
  "/",
  authMiddleware.authMiddleware,
  transactionController.createTransaction,
);

router.post(
  "/system/initial-funds",
  authMiddleware.authMiddlewareForSystemUser,
  transactionController.createInitialFundsTransaction,
);

module.exports = router;
