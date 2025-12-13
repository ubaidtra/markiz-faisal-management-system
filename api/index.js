const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

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
    
    const baseDir = process.cwd();
    const possiblePaths = [
      path.join(baseDir, 'backend'),
      path.join(__dirname, '../backend'),
      path.resolve(__dirname, '../backend'),
    ];
    
    const pathInfo = {
      __dirname: __dirname,
      cwd: baseDir,
      searchedPaths: possiblePaths,
      pathsExist: possiblePaths.map(p => ({
        path: p,
        exists: fs.existsSync(p),
        hasRoutes: fs.existsSync(p) && fs.existsSync(path.join(p, 'routes')),
        hasModels: fs.existsSync(p) && fs.existsSync(path.join(p, 'models'))
      }))
    };
    
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: dbStatus,
      pathInfo: pathInfo
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

const getBackendPath = () => {
  const baseDir = process.cwd();
  const possiblePaths = [
    path.join(baseDir, 'backend'),
    path.join(__dirname, '../backend'),
    path.resolve(__dirname, '../backend'),
    path.join(baseDir, '..', 'backend'),
  ];
  
  for (const backendPath of possiblePaths) {
    const routesPath = path.join(backendPath, 'routes');
    const modelsPath = path.join(backendPath, 'models');
    if (fs.existsSync(backendPath) && fs.existsSync(routesPath) && fs.existsSync(modelsPath)) {
      console.log(`✓ Found backend at: ${backendPath}`);
      return backendPath;
    }
  }
  
  console.error('✗ Backend folder not found');
  console.error('  Searched paths:', possiblePaths);
  console.error('  __dirname:', __dirname);
  console.error('  process.cwd():', process.cwd());
  return null;
};

const backendPath = getBackendPath();

if (!backendPath) {
  app.use('/api/*', (req, res) => {
    res.status(500).json({ 
      message: 'Backend folder not found in serverless function',
      debug: {
        __dirname: __dirname,
        cwd: process.cwd(),
        searchedPaths: [
          path.join(process.cwd(), 'backend'),
          path.join(__dirname, '../backend'),
        ]
      }
    });
  });
} else {
  const loadRoute = (routePath, routeName) => {
    try {
      const fullPath = path.join(backendPath, routePath);
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Route file not found: ${fullPath}`);
      }
      
      const route = require(fullPath);
      app.use(`/api/${routeName}`, route);
      console.log(`✓ Loaded route: /api/${routeName}`);
      return true;
    } catch (error) {
      console.error(`✗ Error loading route ${routeName}:`, error.message);
      console.error(`  Path: ${path.join(backendPath, routePath)}`);
      if (error.stack) {
        console.error(`  Stack:`, error.stack.split('\n').slice(0, 5).join('\n'));
      }
      app.use(`/api/${routeName}`, (req, res) => {
        res.status(500).json({ 
          message: `Route ${routeName} not available`, 
          error: error.message,
          path: path.join(backendPath, routePath)
        });
      });
      return false;
    }
  };

  const seedDefaultUsers = async () => {
    try {
      await connectDB();
      if (mongoose.connection.readyState !== 1) {
        console.log('Database not connected, skipping seed');
        return;
      }

      const userModelPath = path.join(backendPath, 'models/User.js');
      if (!fs.existsSync(userModelPath)) {
        console.log(`User model not found at ${userModelPath}, skipping seed`);
        return;
      }

      const User = require(userModelPath);
      const users = [
        {
          username: 'admin',
          password: 'admin123',
          role: 'admin',
          name: 'System Administrator',
          email: 'admin@faisalcenter.com',
          isActive: true
        },
        {
          username: 'teacher',
          password: 'teacher123',
          role: 'teacher',
          name: 'Default Teacher',
          email: 'teacher@faisalcenter.com',
          isActive: true
        },
        {
          username: 'accountant',
          password: 'accountant123',
          role: 'accountant',
          name: 'Default Accountant',
          email: 'accountant@faisalcenter.com',
          isActive: true
        }
      ];

      for (const userData of users) {
        try {
          const existingUser = await User.findOne({ username: userData.username });
          if (!existingUser) {
            const user = new User(userData);
            await user.save();
            console.log(`✓ Created user: ${userData.username}`);
          } else {
            console.log(`✓ User ${userData.username} already exists`);
          }
        } catch (userError) {
          console.error(`Error creating user ${userData.username}:`, userError.message);
        }
      }
      console.log('✓ User seeding check complete');
    } catch (error) {
      console.error('Error seeding users:', error.message);
      if (error.stack) {
        console.error('Stack:', error.stack.split('\n').slice(0, 5).join('\n'));
      }
    }
  };

  (async () => {
    await seedDefaultUsers();
  })().catch(err => {
    console.error('Seed initialization error:', err.message);
  });

  console.log('Loading routes...');
  loadRoute('routes/auth', 'auth');
  loadRoute('routes/students', 'students');
  loadRoute('routes/teachers', 'teachers');
  loadRoute('routes/halqas', 'halqas');
  loadRoute('routes/quranProgress', 'quran-progress');
  loadRoute('routes/fees', 'fees');
  loadRoute('routes/withdrawals', 'withdrawals');
  loadRoute('routes/reports', 'reports');
  loadRoute('routes/notifications', 'notifications');
  console.log('Routes loading complete');

  try {
    const errorHandlerPath = path.join(backendPath, 'middleware/errorHandler');
    if (fs.existsSync(errorHandlerPath)) {
      const errorHandler = require(errorHandlerPath);
      app.use(errorHandler);
      console.log('✓ Loaded error handler');
    } else {
      throw new Error(`Error handler not found at: ${errorHandlerPath}`);
    }
  } catch (error) {
    console.error('Error loading error handler:', error.message);
    app.use((err, req, res, next) => {
      console.error('Unhandled error:', err.message);
      res.status(500).json({ 
        message: 'Server error', 
        error: err.message 
      });
    });
  }
}

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', path: req.path });
});

module.exports = app;
