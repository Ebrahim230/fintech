const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    if (!userName || !email || !password) return res.status(400).json({ success: false, message: 'Please provide all the required fields.' })
    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).json({ success: false, message: 'User already exists.' })

    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = new User({ userName, email, password: hashedPassword })
    await newUser.save()
    res.status(201).json({ success: true, message: 'User registered successfully.' })
  } catch {
    res.status(500).json({ success: false, message: 'Server Error. Please try again.' })
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) return res.status(400).json({ success: false, message: 'Please provide all required fields.' })
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ success: false, message: 'User does not exist. Please register first.' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ success: false, message: 'Incorrect Password.' })

    const token = jwt.sign({ id: user._id, name: user.userName, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30m' })
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 30 * 60 * 1000 })
    res.status(200).json({ success: true, message: 'logged in successfully.', token, role: user.role, user: user.userName })
  } catch {
    res.status(500).json({ success: false, message: 'Server Error. Please try again.' })
  }
}

const logoutUser = (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' })
  res.status(200).json({ success: true, message: 'User logged out successfully.' })
}

module.exports = { registerUser, loginUser, logoutUser }