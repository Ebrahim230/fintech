import axios from 'axios';
import {API_BASE} from '../api/api'

const getTokenHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return { Authorization: `Bearer ${user?.token}` };
};

export const depositAmount = async (id, amount) => {
  const res = await axios.post(`${API_BASE}/admin/accounts/${id}/deposit`, { amount }, { headers: getTokenHeader() });
  return res.data;
};

export const withdrawAmount = async (id, amount) => {
  const res = await axios.post(`${API_BASE}/admin/accounts/${id}/withdraw`, { amount }, { headers: getTokenHeader() });
  return res.data;
};
export const getAccountTransactions = async (id) => {
  const res = await axios.get(`${API_BASE}/admin/accounts/${id}/transactions`, { headers: getTokenHeader() });
  return res.data;
};