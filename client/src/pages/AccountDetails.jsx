import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getAccountDetailsThunk } from '../redux/adminSlice';
import { depositAmountThunk, withdrawAmountThunk, getAccountTransactionsThunk } from '../redux/accountSlice';
import { FaArrowDown, FaArrowUp, FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AccountDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTxns, setFilteredTxns] = useState([]);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState('');
  const [searchType, setSearchType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const acc = await dispatch(getAccountDetailsThunk(id)).unwrap();
        setAccount(acc);
        const txns = await dispatch(getAccountTransactionsThunk(id)).unwrap();
        setTransactions(txns);
        setFilteredTxns(Array.isArray(txns) ? txns : []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id, dispatch]);

  const handleDeposit = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;
    try {
      const res = await dispatch(depositAmountThunk({ id, amount: Number(amount) })).unwrap();
      setAccount(res);
      const txns = await dispatch(getAccountTransactionsThunk(id)).unwrap();
      setTransactions(txns);
      setFilteredTxns(Array.isArray(txns) ? txns : []);
      setAmount('');
      setShowDeposit(false);
      toast.success('Deposit successful');
    } catch {
      toast.error('Deposit failed');
    }
  };

  const handleWithdraw = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0 || Number(amount) > account.balance) return;
    try {
      const res = await dispatch(withdrawAmountThunk({ id, amount: Number(amount) })).unwrap();
      setAccount(res);
      const txns = await dispatch(getAccountTransactionsThunk(id)).unwrap();
      setTransactions(txns);
      setFilteredTxns(Array.isArray(txns) ? txns : []);
      setAmount('');
      setShowWithdraw(false);
      toast.success('Withdrawal successful');
    } catch {
      toast.error('Withdrawal failed');
    }
  };

  const handleFilter = () => {
    let filtered = transactions;
    if (searchType) filtered = filtered.filter(txn => txn.type.toLowerCase().includes(searchType.toLowerCase()));
    if (startDate) filtered = filtered.filter(txn => new Date(txn.date) >= new Date(startDate));
    if (endDate) filtered = filtered.filter(txn => new Date(txn.date) <= new Date(endDate));
    setFilteredTxns(filtered);
    setCurrentPage(1);
  };

  const resetFilter = () => {
    setSearchType('');
    setStartDate('');
    setEndDate('');
    setFilteredTxns(transactions);
    setCurrentPage(1);
  };

  if (!account) return <p className="text-center mt-10">Loading...</p>;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTxns = Array.isArray(filteredTxns) ? filteredTxns.slice(indexOfFirst, indexOfLast) : [];
  const totalPages = Math.ceil(currentTxns.length ? filteredTxns.length / itemsPerPage : 1);

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 bg-gray-100 min-h-screen relative">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center sm:text-left">Account Details</h1>
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow max-w-3xl mx-auto mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <p><strong>Account Number:</strong> {account.accountNumber}</p>
          <p><strong>Owner:</strong> {account?.owner}</p>
          <p><strong>Type:</strong> {account.accountType}</p>
          <p><strong>Balance:</strong> ${account.balance}</p>
          <p><strong>Status:</strong> <span className={`${account.status === 'Closed' ? 'text-red-600' : 'text-green-600'} font-semibold`}>{account.status}</span></p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => setShowDeposit(true)} className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full sm:w-auto cursor-pointer"><FaArrowDown /> Deposit</button>
          <button onClick={() => setShowWithdraw(true)} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto cursor-pointer"><FaArrowUp /> Withdraw</button>
        </div>
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow max-w-4xl mx-auto overflow-x-auto mb-4">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input type="text" placeholder="Search type" value={searchType} onChange={e => setSearchType(e.target.value)} className="p-2 border rounded w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 border rounded w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 border rounded w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <button onClick={handleFilter} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">Filter</button>
          <button onClick={resetFilter} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 cursor-pointer">Reset</button>
        </div>
        <table className="min-w-full table-auto border-collapse text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 sm:px-4 py-2 text-left">Date</th>
              <th className="border px-2 sm:px-4 py-2 text-left">Type</th>
              <th className="border px-2 sm:px-4 py-2 text-left">Amount</th>
              <th className="border px-2 sm:px-4 py-2 text-left">Balance After</th>
            </tr>
          </thead>
          <tbody>
            {currentTxns.map(txn => (
              <tr key={txn._id} className="hover:bg-gray-50">
                <td className="border px-2 sm:px-4 py-2">{new Date(txn.date).toLocaleString()}</td>
                <td className="border px-2 sm:px-4 py-2">{txn.type}</td>
                <td className={`border px-2 sm:px-4 py-2 ${txn.type === 'Deposit' ? 'text-green-600' : 'text-red-600'}`}>${txn.amount}</td>
                <td className="border px-2 sm:px-4 py-2">${txn.balanceAfter}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 cursor-pointer">Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 cursor-pointer">Next</button>
        </div>
      </div>
      {(showDeposit || showWithdraw) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 cursor-pointer" onClick={() => { setShowDeposit(false); setShowWithdraw(false); }}>
          <div className="bg-white p-6 rounded shadow w-11/12 sm:w-96 cursor-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{showDeposit ? 'Deposit Amount' : 'Withdraw Amount'}</h2>
              <FaTimes className="cursor-pointer" onClick={() => { setShowDeposit(false); setShowWithdraw(false); }} />
            </div>
            <input type="number" placeholder="Enter amount" value={amount} onChange={e => setAmount(e.target.value)} className={`w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 ${showDeposit ? 'focus:ring-green-500' : 'focus:ring-blue-500'}`} />
            <button onClick={showDeposit ? handleDeposit : handleWithdraw} className={`w-full ${showDeposit ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded cursor-pointer`}>
              {showDeposit ? 'Deposit' : 'Withdraw'}
            </button>
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable theme="colored" />
    </div>
  );
};

export default AccountDetailsPage;