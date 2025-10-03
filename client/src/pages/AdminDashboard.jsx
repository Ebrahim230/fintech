import React, { useEffect, useState, useRef } from 'react';
import { fetchAdminStatsThunk, fetchAllAccountsThunk, closeAccountThunk } from '../redux/adminSlice';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiLogOut } from 'react-icons/fi';
import { useDispatch } from 'react-redux';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalAccounts: 0, totalBalance: 0 });
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({ type: '', status: '' });
  const navigate = useNavigate();
  const filterRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const loadData = async () => {
      try {
        const statsData = await dispatch(fetchAdminStatsThunk()).unwrap();
        setStats(statsData);
        const accountsData = await dispatch(fetchAllAccountsThunk()).unwrap();
        const activeAccounts = accountsData.filter(acc => acc.status !== 'Closed');
        setAccounts(activeAccounts);
        setFilteredAccounts(activeAccounts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilter(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCloseAccount = async (id) => {
    if (window.confirm('Are you sure to close this account?')) {
      await dispatch(closeAccountThunk(id)).unwrap();
      const updatedAccounts = accounts.filter(acc => acc._id !== id);
      setAccounts(updatedAccounts);
      setFilteredAccounts(updatedAccounts);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterAccounts(term, filters);
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    filterAccounts(searchTerm, newFilters);
  };

  const resetFilters = () => {
    setFilters({ type: '', status: '' });
    setSearchTerm('');
    setFilteredAccounts(accounts);
  };

  const filterAccounts = (search, filterOptions) => {
    const filtered = accounts.filter(acc => {
      const matchesSearch = acc.accountNumber.toLowerCase().includes(search) || (acc.owner?.userName || acc.owner || '').toLowerCase().includes(search);
      const matchesType = filterOptions.type ? acc.accountType === filterOptions.type : true;
      const matchesStatus = filterOptions.status ? acc.status === filterOptions.status : true;
      return matchesSearch && matchesType && matchesStatus;
    });
    setFilteredAccounts(filtered);
  };

  if (loading) return <p className='text-center mt-10'>Loading...</p>;

  return (
    <div className='p-4 sm:p-6 md:p-8 lg:p-10 bg-gray-100 min-h-screen'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-center sm:text-left'>Admin Dashboard</h1>
        <button onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} className='flex items-center gap-1 bg-gray-800 text-white px-3 py-1 rounded cursor-pointer hover:bg-gray-900'>
          <FiLogOut /> Logout
        </button>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
        {[{ label: 'Total Users', value: stats.totalUsers }, { label: 'Total Accounts', value: stats.totalAccounts }, { label: 'Total Balance', value: `$${stats.totalBalance}` }].map((s) => (
          <div key={s.label} className='bg-white p-4 sm:p-6 rounded-lg shadow text-center'>
            <h2 className='text-lg font-semibold mb-2'>{s.label}</h2>
            <p className='text-2xl sm:text-3xl font-bold'>{s.value}</p>
          </div>
        ))}
      </div>
      <div className='mb-4 flex items-center gap-2 relative'>
        <div className='relative w-full md:w-1/3'>
          <FiSearch className='absolute left-2 top-2.5 text-gray-400' size={18} />
          <input type='text' placeholder='Search by Account No. or Owner' value={searchTerm} onChange={handleSearch} className='w-full pl-8 pr-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
        </div>
        <div ref={filterRef} className='relative'>
          <button className='p-2 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center gap-1' onClick={() => setShowFilter(!showFilter)}>
            <FiFilter size={18} /> Filter
          </button>
          {showFilter && (
            <div className='absolute top-10 left-0 bg-white border rounded-lg shadow p-4 z-50 w-60'>
              <div className='mb-2'>
                <label className='block text-sm font-semibold mb-1'>Account Type</label>
                <select className='w-full border rounded p-1' value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
                  <option value=''>All</option>
                  <option value='Savings'>Savings</option>
                  <option value='Current'>Current</option>
                </select>
              </div>
              <div className='mb-2'>
                <label className='block text-sm font-semibold mb-1'>Status</label>
                <select className='w-full border rounded p-1' value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
                  <option value=''>All</option>
                  <option value='Active'>Active</option>
                  <option value='Closed'>Closed</option>
                </select>
              </div>
              <button className='w-full bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400 mt-2 text-sm' onClick={resetFilters}>Reset Filters</button>
            </div>
          )}
        </div>
      </div>
      <div className='bg-white p-4 sm:p-6 rounded-lg shadow overflow-x-auto'>
        <h2 className='text-xl font-semibold mb-4'>Accounts</h2>
        <table className='min-w-full table-auto border-collapse text-sm sm:text-base'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='border px-2 sm:px-4 py-2 text-left'>Account No.</th>
              <th className='border px-2 sm:px-4 py-2 text-left'>Owner</th>
              <th className='border px-2 sm:px-4 py-2 text-left'>Type</th>
              <th className='border px-2 sm:px-4 py-2 text-left'>Balance</th>
              <th className='border px-2 sm:px-4 py-2 text-left'>Status</th>
              <th className='border px-2 sm:px-4 py-2 text-left'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map(acc => (
              <tr key={acc._id} className='hover:bg-gray-50 cursor-pointer' onClick={() => navigate(`/admin/accounts/${acc._id}`)}>
                <td className='border px-2 sm:px-4 py-2 break-words'>{acc.accountNumber}</td>
                <td className='border px-2 sm:px-4 py-2'>{acc.owner?.userName || acc.owner}</td>
                <td className='border px-2 sm:px-4 py-2'>{acc.accountType}</td>
                <td className='border px-2 sm:px-4 py-2'>${acc.balance}</td>
                <td className={`border px-2 sm:px-4 py-2 font-semibold ${acc.status === 'Closed' ? 'text-red-600' : 'text-green-600'}`}>{acc.status}</td>
                <td className='border px-2 sm:px-4 py-2 flex flex-wrap gap-2'>
                  <button className='bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs sm:text-sm' onClick={(e) => { e.stopPropagation(); handleCloseAccount(acc._id); }}>Close</button>
                  <button className='bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-xs sm:text-sm' onClick={(e) => { e.stopPropagation(); navigate(`/admin/accounts/update/${acc._id}`); }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;