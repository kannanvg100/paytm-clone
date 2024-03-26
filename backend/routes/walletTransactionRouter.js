const express = require('express');
const router = express.Router();
const WalletTransactionController = require('../controllers/walletTransactionController');
const { protect } = require('../middlewares/auth');
const walletTransactionController = require('../controllers/walletTransactionController');

// Route to get all wallet transactions
router.get('/transactions', protect, WalletTransactionController.getAllTransactions);

// Route to add a new transactions
router.post('/transactions', protect, WalletTransactionController.addTransaction);

// Get user balance
router.get('/balance', protect, walletTransactionController.getBalance)

module.exports = router;
