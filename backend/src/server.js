const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const publicRoutes = require('./routes/publicRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api', publicRoutes);

// Health check & root info
app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'Event Ticket System Backend API is active', version: '1.0.0' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Event Ticket System API is running' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
});

const server = app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});