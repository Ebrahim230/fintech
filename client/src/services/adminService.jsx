import axios from 'axios';
import { API_BASE } from '../api/api';

const getTokenHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return { Authorization: `Bearer ${user?.token}` };
};

const fetchAdminStats = async () => {
  const res = await axios.get(`${API_BASE}/admin/stats`, { headers: getTokenHeader() });
  return res.data;
};

const fetchAllAccounts = async () => {
  const res = await axios.get(`${API_BASE}/admin/accounts`, { headers: getTokenHeader() });
  return res.data;
};

const closeAccount = async (id) => {
  const res = await axios.delete(`${API_BASE}/admin/accounts/${id}`, { headers: getTokenHeader() });
  return res.data;
};

const createAccount = async (accountData) => {
  const res = await axios.post(`${API_BASE}/admin/accounts/create`, accountData, { headers: getTokenHeader() });
  return res.data;
};

const updateAccount = async (id, accountData) => {
  const res = await axios.put(`${API_BASE}/admin/accounts/${id}`, accountData, { headers: getTokenHeader() });
  return res.data;
};

const getAccountDetails = async (id) => {
  const res = await axios.get(`${API_BASE}/admin/accounts/${id}`, { headers: getTokenHeader() });
  return res.data;
};

const fetchAccountTypes = async () => {
  const res = await axios.get(`${API_BASE}/admin/accounts/types`, { headers: getTokenHeader() });
  return res.data;
};

export { 
  fetchAdminStats, 
  fetchAllAccounts, 
  closeAccount, 
  createAccount, 
  updateAccount, 
  getAccountDetails, 
  fetchAccountTypes 
};