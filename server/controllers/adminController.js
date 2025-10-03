const User = require('../models/userModel');
const Account = require('../models/accountModel');
const Transaction = require('../models/transactionModel');

const generateAccountNumber = async () => {
  let accountNumber;
  let exists = true;
  while (exists) {
    accountNumber = '5071' + Math.floor(1000000000 + Math.random() * 9000000000);
    exists = await Account.findOne({ accountNumber });
  }
  return accountNumber;
};

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const accounts = await Account.find();
    const totalAccounts = accounts.length;
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    res.json({ totalAccounts, totalUsers, totalBalance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createAccount = async (req, res) => {
  try {
    const { accountType, balance, owner } = req.body;
    const accountNumber = await generateAccountNumber();
    const account = await Account.create({ accountType, balance, owner, accountNumber });
    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAccountDetails = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id).populate("owner", "userName email");
    if (!account) return res.status(404).json({ message: "Account not found" });
    if (req.user.role !== "admin" && account.owner._id.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not authorized" });
    res.json(account);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateAccount = async (req, res) => {
  try {
    const account = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!account) return res.status(404).json({ message: "Account not found" });
    res.json(account);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const closeAccount = async (req, res) => {
  try {
    const account = await Account.findByIdAndDelete(req.params.id);
    if (!account) return res.status(404).json({ message: "Account not found" });
    res.json({ message: "Account deleted", account });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find().populate("owner", "userName email");
    res.json(accounts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAccountTypes = (req, res) => {
  try {
    const accountTypes = Account.schema.path("accountType").enumValues;
    res.json(accountTypes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const depositAmount = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: "Account not found" });
    account.balance += amount;
    await account.save();
    await Transaction.create({ account: account._id, type: "Deposit", amount, balanceAfter: account.balance });
    res.json(account);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const withdrawAmount = async (req, res) => {
  try {
    const { amount } = req.body;
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: "Account not found" });
    if (amount <= 0 || amount > account.balance) return res.status(400).json({ message: "Invalid amount" });
    account.balance -= amount;
    await account.save();
    await Transaction.create({ account: account._id, type: "Withdrawal", amount, balanceAfter: account.balance });
    res.json(account);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAccountTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ account: req.params.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getAdminStats,
  createAccount,
  getAccountDetails,
  updateAccount,
  closeAccount,
  getAllAccounts,
  getAccountTypes,
  depositAmount,
  withdrawAmount,
  getAccountTransactions
};