const express = require('express');
const {getAdminStats, createAccount, getAccountDetails, updateAccount, closeAccount, getAllAccounts,getAccountTypes, withdrawAmount,depositAmount, getAccountTransactions} = require('../controllers/adminController');
const {authMiddleware,roleMiddleware}=require('../middlewares/authMiddleware')
const router = express.Router();

router.get('/stats', authMiddleware,roleMiddleware('admin'),getAdminStats);
router.get('/accounts',authMiddleware,roleMiddleware('admin'),getAllAccounts);
router.get('/accounts/types',authMiddleware,roleMiddleware('admin'),getAccountTypes);
router.delete('/accounts/:id',authMiddleware,roleMiddleware('admin'),closeAccount);
router.post('/accounts/create',authMiddleware,roleMiddleware('admin'),createAccount);
router.put('/accounts/:id',authMiddleware,roleMiddleware('admin'),updateAccount);
router.get('/accounts/:id',authMiddleware,roleMiddleware('admin'),getAccountDetails);
router.post('/accounts/:id/deposit',authMiddleware,roleMiddleware('admin'),depositAmount);
router.post('/accounts/:id/withdraw',authMiddleware,roleMiddleware('admin'),withdrawAmount);
router.get('/accounts/:id/transactions',authMiddleware,roleMiddleware('admin'),getAccountTransactions);

module.exports = router;