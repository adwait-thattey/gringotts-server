const express = require('express');
const app = express();


// Import Routes
const authRoutes = require('./auth/routes');


// Route middlewares
app.use('/api/auth', authRoutes);


app.listen(3000, () => console.log("Server running"));
