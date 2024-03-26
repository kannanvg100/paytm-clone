const WalletTransaction = require('../models/WalletTransaction');
const User = require('../models/User');

module.exports = {

    // Controller method to get all wallet transactions
    getAllTransactions: async (req, res, next) => {
        try {
            const { page = 1, limit = 6 } = req.query;
            const offset = (page - 1) * limit;

            const { rows: transactions, count: total } = await WalletTransaction.findAndCountAll({
                where: { userId: req.user.userId },
                order: [['createdAt', 'DESC']],
                limit,
                offset,
            });

            res.status(200).json({ transactions, total });
        } catch (error) {
            next(error);
        }
    },

    // Controller method to add a new wallet transaction
    addTransaction: async (req, res, next) => {
        try {
            const type = req.body.type;
            const amount = Number(req.body.amount);
            const description = req.body?.description || 'Added money to wallet';
            const comments = req.body?.comment || 'Bank txn ID 1234567890'
            const user = await User.findByPk(req.user.userId);
            if (!user) return res.status(404).json({ message: 'User not found' });
            if (type === 'debit' && Number(user.balance) < amount) return res.status(400).json({ message: 'Insufficient balance' });
            const newTransaction = await WalletTransaction.create({ userId: req.user.userId, amount, description, comments, type });
            const newBalance = type === 'credit' ? Number(user.balance) + amount : Number(user.balance) - amount;
            await user.update({ balance: newBalance })
            res.status(201).json({ newTransaction, user });
        } catch (error) {
            next(error);
        }
    },

    // get user balance
    getBalance: async (req, res, next) => {
        try {
            const user = await User.findByPk(req.user.userId);
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.status(200).json({ balance: user.balance });
        } catch (error) {
            next(error);
        }
    }




}
