import axios from 'axios'

const API_URL = 'http://localhost:8000/api/auth'

const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData)
    return response?.data;
  } catch (error) {
    return error.response?.data || { success: false, message: 'Something went wrong' }
  }
}

const login = async (userData) => {
  const res = await axios.post(`${API_URL}/login`, userData)
  return res.data
}

export const authService = { register, login };