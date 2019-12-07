const config = require('./config');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
dotenv.config();

// Import Routes
const authRoutes = require('./auth/routes');
const engineRoutes = require('./engine/routes');
const credentialRoutes = require('./credentials/routes');
const dynamicRoutes = require('./dynamic_credentials/routes');
const sshRoutes = require('./ssh/routes');

// Middleware to authenticate token and add req.user
const addToken = require('./middlewares/addAuthToken');

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

// Add Auth Token
app.use(addToken);
app.use(cors());

// Route middlewares
app.use('/api/auth', authRoutes);
app.use('/api/engine', engineRoutes);
app.use('/api/creds', credentialRoutes);
app.use('/api/dynamic',dynamicRoutes);
app.use('/api/ssh', sshRoutes);
app.listen(config.port, () => console.log(`Server running on ${config.port}`));
