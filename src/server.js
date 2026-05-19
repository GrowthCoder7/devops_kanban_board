const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // 1. Import the native path module
require('dotenv').config();

const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/kanban';

// Middleware
app.use(cors());
app.use(express.json());

// 2. Force an absolute path to the public directory
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/tasks', taskRoutes);

// Connect to MongoDB & Start Server
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully.');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });