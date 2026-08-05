const transactionRepository = require("../repositories/transaction.repository");
const accountRepository = require("../repositories/account.repository");
const apiError = require("../utils/apiError");

/**
 * - create a new transaction between two accounts with idempotency key
 * THE 10-STEP TRANSACTION PROCESS:
 * 1. Validate Request
 * 2. Validate Idempotency Key
 * 3. Check Account Status
 * 4. Derive Sender Balance from ledger
 * 5. Create Transaction Pending
 * 6. Create Debit ledger entry
 * 7. Create Credit ledger entry
 * 8. Mark Transaction Completed
 * 9. Commit MongoDb session
 * 10. send email notification
 */
exports.createTransaction = async (
  fromAccount,
  toAccount,
  amount,
  idempotencyKey,
) => {
  /**
   * 1. Validate Request
   */
  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    throw new apiError(
      400,
      "FromAccount, ToAccount, Amount, and Idempotency key are required",
    );
  }

  const fromUserAccount = await accountRepository.findAccountById(fromAccount);

  if (!fromUserAccount) {
    throw new apiError(404, "From account not found");
  }

  const toUserAccount = await accountRepository.findAccountById(toAccount);

  if (!toUserAccount) {
    throw new apiError(404, "To account not found");
  }

  /**
   * 2. Validate Idempotency Key
   */
  const existingTransaction =
    await transactionRepository.findByIdempotencyKey(idempotencyKey);

  if (existingTransaction) {
    if (existingTransaction.status === "COMPLETED") {
      return {
        message: "Transaction already completed",
        transaction: existingTransaction,
      };
    }

    if (existingTransaction.status === "PENDING") {
      return {
        message: "Transaction is still processing, please wait",
      };
    }

    if (existingTransaction.status === "FAILED") {
      throw new apiError(
        409,
        "Transaction with this idempotency key already exists and failed",
      );
    }

    if (existingTransaction.status === "REVERSED") {
      return {
        message:
          "Transaction has been reversed, please initiate a new transaction",
      };
    }
  }

  /**
   * 3. Check Account Status
   */
  if (fromUserAccount.status !== "ACTIVE") {
    throw new apiError(400, "From account is not active");
  }

  if (toUserAccount.status !== "ACTIVE") {
    throw new apiError(400, "To account is not active");
  }

  /**
   * 4. Derive Sender Balance from ledger
   */
  const senderBalance = await fromUserAccount.getBalance();

  if (senderBalance < amount) {
    throw new apiError(
      400,
      `Insufficient funds. Available balance: ${senderBalance}, Requested amount: ${amount}`,
    );
  }
};

exports.createInitialFundsTransaction = async (
  systemUser,
  toAccount,
  amount,
  idempotencyKey,
) => {
  if (!toAccount) {
    throw new apiError(400, "To account is required");
  }
  if (!idempotencyKey || idempotencyKey.trim() === "") {
    throw new apiError(400, "Idempotency key is required");
  }
  if (amount <= 0) {
    throw new apiError(400, "Amount must be greater than zero");
  }
  // Check if a transaction with the same idempotencyKey already exists
  const existingTransaction =
    await transactionRepository.findByIdempotencyKey(idempotencyKey);
  if (existingTransaction) {
    throw new apiError(
      409,
      "Transaction with this idempotency key already exists",
    );
  }

  const toAccountData = await transactionRepository.findAccountById(toAccount);

  if (!toAccountData) {
    throw new apiError(404, "To account not found");
  }

  const fromAccountData = await transactionRepository.findSystemAccount(
    systemUser._id,
  );

  if (!fromAccountData) {
    throw new apiError(404, "System account not found");
  }

  const session = await transactionRepository.startTransaction();
  try {
    const transaction =
      await transactionRepository.createInitialFundsTransaction(
        fromAccountData,
        toAccountData,
        amount,
        idempotencyKey,
        session,
      );
    await transactionRepository.commitTransaction(session);
    return transaction;
  } catch (error) {
    await transactionRepository.abortTransaction(session);
    throw error;
  } finally {
    session.endSession();
  }
};
