const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://Abdoullahsecka:secka281986@cluster0.lxszwnk.mongodb.net/faisal-center?retryWrites=true&w=majority&appName=markiz-faisal-management-system')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

app.use('/api/auth', require('../backend/routes/auth'));
app.use('/api/students', require('../backend/routes/students'));
app.use('/api/teachers', require('../backend/routes/teachers'));
app.use('/api/halqas', require('../backend/routes/halqas'));
app.use('/api/quran-progress', require('../backend/routes/quranProgress'));
app.use('/api/fees', require('../backend/routes/fees'));
app.use('/api/withdrawals', require('../backend/routes/withdrawals'));
app.use('/api/reports', require('../backend/routes/reports'));
app.use('/api/notifications', require('../backend/routes/notifications'));

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

const errorHandler = require('../backend/middleware/errorHandler');
app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;

