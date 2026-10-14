require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { apiDailyLimiter, authLimiter } = require('./middleware/rateLimiter');
const appointmentRoutes = require('./routes/appointmentRoutes');
const authRoutes = require('./routes/authRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// REQUIRED FOR MOBILE TRAFFIC & CLOUD HOSTING (Render/Heroku/AWS):
// Enables Express to read X-Forwarded-For headers from mobile network proxies
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiters
app.use('/api/', apiDailyLimiter);
app.use('/api/auth', authLimiter);

// Routes
app.use('./api/appointments', appointmentRoutes);
app.use('./api/auth', authRoutes);

// Health check
app.get('./api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});