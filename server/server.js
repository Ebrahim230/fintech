const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
dotenv.config();
const port = process.env.PORT || 5000;
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin',adminRoutes);

app.listen(port,()=>{
    console.log(`Server running on port: ${port}`);
})