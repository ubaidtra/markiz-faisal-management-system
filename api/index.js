const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://Abdoullahsecka:secka281986@cluster0.lxszwnk.mongodb.net/faisal-center?retryWrites=true&w=majority&appName=markiz-faisal-management-system';
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    isConnected = false;
  }
};

app.use(async (req, res, next) => {
  if (!isConnected && mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  next();
});

app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: dbStatus
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

const backendPath = path.join(__dirname, '../backend');

const loadRoute = (routePath, routeName) => {
  try {
    const route = require(path.join(backendPath, routePath));
    app.use(`/api/${routeName}`, route);
    console.log(`Loaded route: /api/${routeName}`);
    return true;
  } catch (error) {
    console.error(`Error loading route ${routeName}:`, error);
    app.use(`/api/${routeName}`, (req, res) => {
      res.status(500).json({ 
        message: `Route ${routeName} not available`, 
        error: error.message 
      });
    });
    return false;
  }
};

loadRoute('routes/auth', 'auth');
loadRoute('routes/students', 'students');
loadRoute('routes/teachers', 'teachers');
loadRoute('routes/halqas', 'halqas');
loadRoute('routes/quranProgress', 'quran-progress');
loadRoute('routes/fees', 'fees');
loadRoute('routes/withdrawals', 'withdrawals');
loadRoute('routes/reports', 'reports');
loadRoute('routes/notifications', 'notifications');

try {
  const errorHandler = require(path.join(backendPath, 'middleware/errorHandler'));
  app.use(errorHandler);
} catch (error) {
  console.error('Error loading error handler:', error);
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message 
    });
  });
}

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', path: req.path });
});

module.exports = app;
