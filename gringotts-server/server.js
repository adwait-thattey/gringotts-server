const config = require('./config');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

// Import Routes
const authRoutes = require('./auth/routes');

// Connect to DB
mongoose.connect(
    `mongodb+srv://${config.mongo.username}:${config.mongo.password}@${config.mongo.host}/${config.mongo.dbname}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("connected to db");
    }
);

// Middleware
app.use(express.json());

// Route middlewares
app.use('/api/auth', authRoutes);
app.listen(config.port, () => console.log(`Server running on ${config.port}`));
